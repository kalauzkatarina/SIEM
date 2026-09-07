import { v4 as uuidv4 } from "uuid";
import { SimulationRequestDTO } from "../Domain/DTOs/SimulationRequestDTO";
import { SimulationResponseDTO } from "../Domain/DTOs/SimulationResponseDTO";
import { SimulationTimelinePointDTO } from "../Domain/DTOs/SimulationTimelinePointDTO";
import { SimulationError } from "../Domain/errors/SimulationError";
import { IEventEmitter } from "../Domain/services/IEventEmitter";
import { ISimulationService } from "../Domain/services/ISimulationService";
import { SimulationStatus } from "../Domain/types/SimulationStatus";
import { SimulationType } from "../Domain/types/SimulationType";
import { EventDTO } from "../Domain/types/EventDTO";

type SimulationSession = {
  state: SimulationResponseDTO;
  timeoutId?: NodeJS.Timeout;
  isTickInProgress: boolean;
  startedAtMs: number;
};

export class SimulationService implements ISimulationService {
  private readonly sessions = new Map<string, SimulationSession>();
  private readonly maxConcurrentSimulations: number;
  private readonly maxHistoryItems: number;

  constructor(private readonly emitter: IEventEmitter) {
    this.maxConcurrentSimulations = this.readPositiveIntEnv("SIMULATOR_MAX_CONCURRENT", 3);
    this.maxHistoryItems = this.readPositiveIntEnv("SIMULATOR_MAX_HISTORY", 200);
  }

  async startSimulation(request: SimulationRequestDTO): Promise<SimulationResponseDTO> {
    if (this.getRunningSessionsCount() >= this.maxConcurrentSimulations) {
      throw new SimulationError(
        `Too many active simulations. Maximum allowed is ${this.maxConcurrentSimulations}.`,
        409
      );
    }

    const id = uuidv4();
    const now = new Date();
    const intensity = Math.max(1, Math.floor(request.intensity));
    const durationSeconds = Math.max(1, Math.floor(request.durationSeconds));
    const target = this.normalizeTarget(request.target);

    const state: SimulationResponseDTO = {
      id,
      type: request.type,
      status: SimulationStatus.RUNNING,
      intensity,
      durationSeconds,
      target,
      startedAt: now.toISOString(),
      eventsGenerated: 0,
      timeline: [],
    };

    const session: SimulationSession = {
      state,
      isTickInProgress: false,
      startedAtMs: now.getTime(),
    };

    this.sessions.set(id, session);
    this.trimHistoryIfNeeded();
    this.scheduleNextTick(session, 0);

    return state;
  }

  async stopSimulation(id: string): Promise<SimulationResponseDTO | null> {
    const session = this.sessions.get(id);
    if (!session) return null;

    this.clearScheduledTick(session);

    if (session.state.status === SimulationStatus.RUNNING) {
      session.state.status = SimulationStatus.STOPPED;
      session.state.endedAt = new Date().toISOString();
    }

    return session.state;
  }

  getSimulation(id: string): SimulationResponseDTO | null {
    return this.sessions.get(id)?.state ?? null;
  }

  listSimulations(): SimulationResponseDTO[] {
    return Array.from(this.sessions.values())
      .map((s) => s.state)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }

  private scheduleNextTick(session: SimulationSession, delayMs: number): void {
    this.clearScheduledTick(session);
    session.timeoutId = setTimeout(() => {
      void this.emitBatch(session);
    }, delayMs);
  }

  private clearScheduledTick(session: SimulationSession): void {
    if (!session.timeoutId) {
      return;
    }

    clearTimeout(session.timeoutId);
    session.timeoutId = undefined;
  }

  private async emitBatch(session: SimulationSession): Promise<void> {
    if (session.state.status !== SimulationStatus.RUNNING) {
      return;
    }

    if (session.isTickInProgress) {
      return;
    }

    session.isTickInProgress = true;

    const elapsed = Math.floor((Date.now() - session.startedAtMs) / 1000);
    if (elapsed >= session.state.durationSeconds) {
      this.completeSession(session);
      session.isTickInProgress = false;
      return;
    }

    const now = new Date();
    const events: EventDTO[] = [];

    for (let i = 0; i < session.state.intensity; i++) {
      events.push(this.buildEvent(session.state, now));
    }

    let succeeded = 0;
    for (const event of events) {
      try {
        await this.emitter.emitEvent(event);
        succeeded += 1;
      } catch (err) {
        session.state.eventsGenerated += succeeded;
        session.state.status = SimulationStatus.FAILED;
        session.state.endedAt = new Date().toISOString();

        const msg = err instanceof Error ? err.message : "Unknown emitter error";
        this.appendTimeline(session.state, succeeded, now, `EMIT_ERROR: ${msg}`);
        this.clearScheduledTick(session);
        session.isTickInProgress = false;
        return;
      }
    }

    session.state.eventsGenerated += succeeded;
    this.appendTimeline(session.state, succeeded, now);

    session.isTickInProgress = false;
    if (session.state.status === SimulationStatus.RUNNING) {
      this.scheduleNextTick(session, 1000);
    }
  }

  private completeSession(session: SimulationSession): void {
    this.clearScheduledTick(session);
    if (session.state.status !== SimulationStatus.RUNNING) {
      return;
    }

    session.state.status = SimulationStatus.COMPLETED;
    session.state.endedAt = new Date().toISOString();
  }

  private appendTimeline(
    state: SimulationResponseDTO,
    count: number,
    time: Date,
    note?: string
  ): void {
    const point: SimulationTimelinePointDTO = {
      timestamp: time.toISOString(),
      count,
    };

    if (note) {
      point.note = note;
    }

    state.timeline.push(point);
  }

  private buildEvent(state: SimulationResponseDTO, time: Date): EventDTO {
    const correlationId = state.id;
    const target = state.target ?? "unknown";

    const description = this.fitDescriptionToEventLimit([
      "SIMULATION",
      `simulationId=${state.id}`,
      `correlationId=${correlationId}`,
      `type=${state.type}`,
      `target=${target}`,
    ]);

    return {
      source: `SIMULATOR:${state.type}`,
      type: this.mapEventType(state.type),
      description,
      timestamp: time.toISOString(),
    };
  }

  private fitDescriptionToEventLimit(parts: string[]): string {
    const maxLen = 255;
    const separator = " | ";
    let description = parts.join(separator);

    if (description.length <= maxLen) {
      return description;
    }

    const prefix = parts.slice(0, 4).join(separator);
    const targetPrefix = `${separator}target=`;
    const remaining = Math.max(0, maxLen - prefix.length - targetPrefix.length);

    description = `${prefix}${targetPrefix}${parts[4].slice(7, 7 + remaining)}`;
    return description.slice(0, maxLen);
  }

  private mapEventType(type: SimulationType): EventDTO["type"] {
    switch (type) {
      case SimulationType.PRIVILEGE_ESCALATION:
        return "ERROR";
      case SimulationType.DDOS:
        return "WARNING";
      case SimulationType.BRUTE_FORCE:
      default:
        return "WARNING";
    }
  }

  private normalizeTarget(target?: string): string | undefined {
    if (!target) {
      return undefined;
    }

    const trimmed = target.trim();
    if (!trimmed) {
      return undefined;
    }

    return trimmed.slice(0, 120);
  }

  private getRunningSessionsCount(): number {
    let running = 0;
    for (const session of this.sessions.values()) {
      if (session.state.status === SimulationStatus.RUNNING) {
        running += 1;
      }
    }

    return running;
  }

  private trimHistoryIfNeeded(): void {
    if (this.sessions.size <= this.maxHistoryItems) {
      return;
    }

    const finishedSessions = Array.from(this.sessions.values())
      .filter((s) => s.state.status !== SimulationStatus.RUNNING)
      .sort((a, b) => new Date(a.state.startedAt).getTime() - new Date(b.state.startedAt).getTime());

    while (this.sessions.size > this.maxHistoryItems && finishedSessions.length > 0) {
      const oldest = finishedSessions.shift();
      if (!oldest) {
        break;
      }
      this.sessions.delete(oldest.state.id);
    }
  }

  private readPositiveIntEnv(name: string, fallback: number): number {
    const raw = process.env[name];
    if (!raw) {
      return fallback;
    }

    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return fallback;
    }

    return parsed;
  }
}
