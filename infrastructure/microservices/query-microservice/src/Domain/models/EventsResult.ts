import { EventDTO } from "../DTOs/EventDTO";

export class EventsResult{
    total!: number;
    data!: EventDTO[];
    page!: number;
    limit!: number;
}