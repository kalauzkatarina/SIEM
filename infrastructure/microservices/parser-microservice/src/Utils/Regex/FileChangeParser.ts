import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { EventType } from "../../Domain/enums/EventType";
import { ParseResult } from "../../Domain/types/ParseResult";
import { extractUsernameFromMessage } from "./ExtractUsername";

// 7
export function parseFileChangeMessage(message: string): ParseResult {
    const FILE_EVENT_REGEX = /\b(file\s*(changed|modified|modification|edited|tampered|corrupted)|malicious\s+file|infected\s+file|virus\s+detected|unauthorized\s+file\s*(change|modification)|checksum\s*(failed|mismatch)|hash\s*(failed|mismatch)|integrity\s*(check\s*)?(failed|mismatch))\b/i;

    if (!FILE_EVENT_REGEX.test(message))
        return { doesMatch: false };

    const username = extractUsernameFromMessage(message);

    const normalizedDescription = username !== ''
        ? `File integrity issue detected involving user '${username}'.`
        : `File integrity issue detected.`;

    const event: EventDTO = {
        id: 0,
        type: EventType.ERROR,
        description: normalizedDescription,
    };

    return {
        doesMatch: true,
        event
    };
}
