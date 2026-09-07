import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { EventType } from "../../Domain/enums/EventType";
import { ParseResult } from "../../Domain/types/ParseResult";
import { extractUsernameFromMessage } from "./ExtractUsername";

// 1
export function parseLoginMessage(message: string): ParseResult {
        const SUCCESS_LOGIN_REGEX = /\b(success(ful(ly)?)?|logged\s+in|login\s+ok|authentication\s+successful)\b/i;
        const FAIL_LOGIN_REGEX = /\b(fail(ed)?|unsuccessful|incorrect|invalid|denied|error).*(login|authentication)\b/i;

        if (!SUCCESS_LOGIN_REGEX.test(message) && !FAIL_LOGIN_REGEX.test(message))      // Checks for login event
            return { doesMatch: false };

        const username = extractUsernameFromMessage(message);
        if (username === '')
            return { doesMatch: false };

        const normalizedDescription = SUCCESS_LOGIN_REGEX.test(message) ?
            `User '${username}' successfully logged in.` : `Unsuccessful login attempt for user '${username}'.`;

        const event: EventDTO = {
            id: 0,
            type: EventType.INFO,
            description: normalizedDescription,
        };

        return {
            doesMatch: true,
            event
        };
    }