import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { EventType } from "../../Domain/enums/EventType";
import { ParseResult } from "../../Domain/types/ParseResult";
import { extractUsernameFromMessage } from "./ExtractUsername";

// 5B
export function parseSqlInjectionMessage(message: string): ParseResult {
    const SQLI_REGEX = /\b(sql(\s|-)?injection|sqli|potential\s*sql\s*injection|sql\s*attack|sql\s*exploit)\b/i;

    if (!SQLI_REGEX.test(message))
        return { doesMatch: false };

    const username = extractUsernameFromMessage(message);

    const normalizedDescription = username !== ''
        ? `Potential SQL injection attempt detected targeting user '${username}'.`
        : `Potential SQL injection attempt detected.`;

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