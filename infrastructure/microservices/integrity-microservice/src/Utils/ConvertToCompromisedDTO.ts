import type { CompromisedLogDTO } from "../Domain/DTOs/CompromisedLogDTO";
import { IntegrityLog } from "../Domain/models/IntegrityLog";
import type { EventDTO } from "../Domain/DTOs/EventDTO";

export function toCompromisedDTO(log: IntegrityLog, event: EventDTO, calculatedHash: string, isMissing = false): CompromisedLogDTO {
  return {
    event,
    storedHash: log.hash,
    calculatedHash,
    isMissing,
    detectedAt: log.createdAt
  };
} 