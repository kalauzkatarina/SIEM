import { SimulationType } from "../types/SimulationType";

export interface SimulationRequestDTO {
  type: SimulationType;
  intensity: number;
  durationSeconds: number;
  target?: string;
}
