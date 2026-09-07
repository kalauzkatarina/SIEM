import { EventDTO } from "../../models/events/EventDTO";

export interface IEventAPI {
  getAllEvents(token: string): Promise<EventDTO[]>;
}
