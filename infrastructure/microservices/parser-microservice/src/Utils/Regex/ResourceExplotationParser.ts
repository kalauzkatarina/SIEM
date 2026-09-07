import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { EventType } from "../../Domain/enums/EventType";
import { ParseResult } from "../../Domain/types/ParseResult";
import { extractUsernameFromMessage } from "./ExtractUsername";

// 6B
export function pareseResourceExplotationMessage(message: string): ParseResult {
    const RESOURCE_EXPLOIT_REGEX = /\b(cpu|processor|memory|ram|disk|storage|resource)\s*(overuse|abuse|exhaustion|spike|anomaly|overflow|limit|hog|leak)\b/i;

    if (!RESOURCE_EXPLOIT_REGEX.test(message))
        return { doesMatch: false };

    const username = extractUsernameFromMessage(message);

    const normalizedDescription = username !== ''
        ? `Suspicious resource usage anomaly detected involving user '${username}'.`
        : `Suspicious resource usage anomaly detected.`;

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