import axios, { AxiosInstance } from "axios";
import { SimulationError } from "../Domain/errors/SimulationError";
import { IEventEmitter } from "../Domain/services/IEventEmitter";
import { EventDTO } from "../Domain/types/EventDTO";

export class HttpEventEmitter implements IEventEmitter {
  private readonly client: AxiosInstance;

  constructor(baseUrl?: string) {
    if (!baseUrl || baseUrl.trim().length === 0) {
      throw new SimulationError("EVENT_COLLECTOR_API is required for simulator emitter.", 500);
    }

    this.client = axios.create({
      baseURL: baseUrl.trim(),
      headers: { "Content-Type": "application/json" },
      timeout: 5000,
    });
  }

  async emitEvent(event: EventDTO): Promise<void> {
    await this.client.post("/api/v1/events", event);
  }
}
