import { SimulationDTO, SimulationType } from "../../models/simulator/SimulationDTO";

export interface SimulationRequestDTO {
  type: SimulationType;
  intensity: number;
  durationSeconds: number;
  target?: string;
}

export interface ISimulatorAPI {
  startSimulation(payload: SimulationRequestDTO, token: string): Promise<SimulationDTO>;
  stopSimulation(id: string, token: string): Promise<SimulationDTO>;
  getSimulation(id: string, token: string): Promise<SimulationDTO>;
  listSimulations(token: string): Promise<SimulationDTO[]>;
}
