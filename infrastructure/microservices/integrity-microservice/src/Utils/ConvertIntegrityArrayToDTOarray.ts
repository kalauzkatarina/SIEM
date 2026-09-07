import type { CompromisedLogDTO } from "../Domain/DTOs/CompromisedLogDTO";
import { IntegrityLog } from "../Domain/models/IntegrityLog";
import { toCompromisedDTO } from "./ConvertToCompromisedDTO";
import type { EventDTO } from "../Domain/DTOs/EventDTO";

export function ArrayToCompromisedDTO(logs: IntegrityLog[], events: EventDTO[], calculatedHashes: string[], isMissingFlags?: boolean[]): CompromisedLogDTO[] {
  const dtos: CompromisedLogDTO[] = [];

  for (let i = 0; i < logs.length; i++) {
    const event = events && events[i] ? events[i] : ({ id: logs[i].eventId } as EventDTO);
    const calculated = calculatedHashes && calculatedHashes[i] ? calculatedHashes[i] : "";
    const isMissing = isMissingFlags ? !!isMissingFlags[i] : false;
    dtos.push(toCompromisedDTO(logs[i], event, calculated, isMissing));
  }

  return dtos;
} 