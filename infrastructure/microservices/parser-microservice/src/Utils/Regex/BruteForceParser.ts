import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { EventType } from "../../Domain/enums/EventType";
import { ParseResult } from "../../Domain/types/ParseResult";
import { extractUsernameFromMessage } from "./ExtractUsername";

// 5A
export function parseBruteForceMessage(message: string): ParseResult {
    const BRUTE_FORCE_REGEX = /\b(brute\s*force\s*(attack|attempt|detected)?)\b/i;

    if (!BRUTE_FORCE_REGEX.test(message))
        return { doesMatch: false };

    const username = extractUsernameFromMessage(message);

    const normalizedDescription = username !== ''
        ? `Brute force attack detected from or targeting user '${username}'.`
        : `Brute force attack detected.`;

    const event: EventDTO = {
        id: 0,
        type: EventType.WARNING,
        description: normalizedDescription,
    };

    return {
        doesMatch: true,
        event
    };
}