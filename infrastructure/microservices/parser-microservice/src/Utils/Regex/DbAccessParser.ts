import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { EventType } from "../../Domain/enums/EventType";
import { ParseResult } from "../../Domain/types/ParseResult";
import { extractUsernameFromMessage } from "./ExtractUsername";

// 3
export function parseDbAccessMessage(message: string): ParseResult {
    const DB_ACCESS_REGEX = /\b(bulk|massive|large|batch)\s+(read|select|insert|update|delete|export|import|operation|query|write)s?\b/i;

    if (!DB_ACCESS_REGEX.test(message))
        return { doesMatch: false };

    const username = extractUsernameFromMessage(message);
    if (username === '')
        return { doesMatch: false };

    const normalizedDescription = `User '${username}' performed a large database access operation.`;

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