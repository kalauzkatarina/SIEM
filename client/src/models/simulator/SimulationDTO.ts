export type SimulationType = "BRUTE_FORCE" | "PRIVILEGE_ESCALATION" | "DDOS";

export type SimulationStatus = "RUNNING" | "STOPPED" | "COMPLETED" | "FAILED";

export interface SimulationTimelinePointDTO {
  timestamp: string;
  count: number;
}

export interface SimulationDTO {
  id: string;
  type: SimulationType;
  status: SimulationStatus;
  intensity: number;
  durationSeconds: number;
  target?: string;
  startedAt: string;
  endedAt?: string;
  eventsGenerated: number;
  timeline: SimulationTimelinePointDTO[];
}
