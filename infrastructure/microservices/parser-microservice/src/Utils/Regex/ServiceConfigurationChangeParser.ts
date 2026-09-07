import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { EventType } from "../../Domain/enums/EventType";
import { ParseResult } from "../../Domain/types/ParseResult";
import { extractUsernameFromMessage } from "./ExtractUsername";

// 6A
export function parseServiceConfigurationChangeMessage(message: string): ParseResult {
    const SERVICE_CONFIG_REGEX = /\b(config(uration)?\s*(file|setting|service)?\s*((was\s*)?(changed?|modified?|updated?|edited?))|service\s*(restart(ed)?|reloaded?|stopped?|started?)|settings\s*((was\s*)?(changed?|updated?|modified?)))\b/i;

    if (!SERVICE_CONFIG_REGEX.test(message))
        return { doesMatch: false };

    const username = extractUsernameFromMessage(message);

    const normalizedDescription = username !== ''
        ? `Service or configuration change made by user '${username}'.`
        : `Service or configuration change detected.`;

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