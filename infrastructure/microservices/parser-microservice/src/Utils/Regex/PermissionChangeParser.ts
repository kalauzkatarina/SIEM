import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { EventType } from "../../Domain/enums/EventType";
import { ParseResult } from "../../Domain/types/ParseResult";
import { extractUsernameFromMessage } from "./ExtractUsername";

export function parsePermissionChangeMessage(message: string): ParseResult {
    const PERMISSION_CHANGE_REGEX = /\b((permission|role|access|privilege)(s)?\s+(changed?|updated?|granted?|assigned?)|(promoted?|elevated?|upgraded?)\s+to|(admin|privileged?|manager|supervisor)\s+(role|access|rights?)(s?)?\s+(granted?|assigned?))\b/i;

    if (!PERMISSION_CHANGE_REGEX.test(message))
        return { doesMatch: false };

    const username = extractUsernameFromMessage(message);
    if (username === '')
        return { doesMatch: false };

    const normalizedDescription = `User '${username}' permissions or roles changed.`;

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