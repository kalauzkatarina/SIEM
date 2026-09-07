import { SimulationStatus } from "../types/SimulationStatus";
import { SimulationType } from "../types/SimulationType";
import { SimulationTimelinePointDTO } from "./SimulationTimelinePointDTO";

export interface SimulationResponseDTO {
  id: string;
  type: SimulationType;
  status: SimulationStatus;
  intensity: number;
  durationSeconds: number;
  target?: string;
  startedAt: string;
  endedAt?: string;
  eventsGenerated: number;
  timeline: SimulationTimelinePointDTO[];
}
