import { EventDTO } from "../types/EventDTO";

export interface IEventEmitter {
  emitEvent(event: EventDTO): Promise<void>;
}
