import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { EventType } from "../../Domain/enums/EventType";
import { ParseResult } from "../../Domain/types/ParseResult";
import { extractUsernameFromMessage } from "./ExtractUsername";

    // 8
export function parseNetworkAnomalyMessage(message: string): ParseResult {
        //sus ip, ip scanning, ip abuese
        const IP_ANOMALY_REGEX = /\b(ip\s*(abuse|misuse|attack|scan|scanning|flood|probe|spoof))\b/i;
        //unknown device, unauthorized device, device attack
        const DEVICE_ANOMALY_REGEX = /\b(unauthorized\s*device|unknown\s*device|device\s*(attack|probe|breach))\b/i;
        //Network anomaly, service abuse, service intrusion
        const SERVICE_ANOMALY_REGEX = /\b(network\s*(anomaly|intrusion|attack|suspicious|breach)|service\s*(abuse|attack|misuse))\b/i;

        if (!IP_ANOMALY_REGEX.test(message) && !DEVICE_ANOMALY_REGEX.test(message) && !SERVICE_ANOMALY_REGEX.test(message))
            return { doesMatch: false };

        const username = extractUsernameFromMessage(message);

        const normalizedDescription = username !== ''
            ? `Network anomaly detected involving user '${username}'.`
            : `Network anomaly detected.`;

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