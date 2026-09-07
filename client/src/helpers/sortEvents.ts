import { EventRow } from "../types/events/EventRow";

export function sortEvents(events: EventRow[], sortType: number): EventRow[] {
    let copy = [...events];

    if (sortType === 1) {
        copy.sort((a, b) => a.source.localeCompare(b.source));
    } else if (sortType === 2) {
        copy.sort((a, b) => b.source.localeCompare(a.source));
    } else if (sortType === 3) {
        copy.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    } else if (sortType === 4) {
        copy.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    } else if (sortType === 5) {
        copy.sort((a, b) => a.type.localeCompare(b.type));
    } else if (sortType === 6) {
        copy.sort((a, b) => b.type.localeCompare(a.type));
    }
    return copy;
}