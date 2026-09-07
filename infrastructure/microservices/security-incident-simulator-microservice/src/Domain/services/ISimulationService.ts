import { SimulationRequestDTO } from "../DTOs/SimulationRequestDTO";
import { SimulationResponseDTO } from "../DTOs/SimulationResponseDTO";

export interface ISimulationService {
  startSimulation(request: SimulationRequestDTO): Promise<SimulationResponseDTO>;
  stopSimulation(id: string): Promise<SimulationResponseDTO | null>;
  getSimulation(id: string): SimulationResponseDTO | null;
  listSimulations(): SimulationResponseDTO[];
}
