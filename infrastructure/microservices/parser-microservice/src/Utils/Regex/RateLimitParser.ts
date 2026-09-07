import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { EventType } from "../../Domain/enums/EventType";
import { ParseResult } from "../../Domain/types/ParseResult";
import { extractUsernameFromMessage } from "./ExtractUsername";

// 4
export function parseRateLimitMessage(message: string): ParseResult {
    const RATE_LIMIT_REGEX = /\b(rate\s+limit(ed)?|quota\s+exceeded|throttled?|429|too\s+many\s+requests)\b/i;

    if (!RATE_LIMIT_REGEX.test(message)) {
        return { doesMatch: false };
    }

    const username = extractUsernameFromMessage(message);

    const normalizedDescription = username !== ''
        ? `User '${username}' exceeded API rate limit.`
        : `API rate limit exceeded.`;

    const event: EventDTO = {
        id: 0,
        type: EventType.WARNING,
        description: normalizedDescription,
    };

    return {
        doesMatch: true,
        event,
    };
}