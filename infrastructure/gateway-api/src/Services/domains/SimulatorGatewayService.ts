import axios, { AxiosInstance } from "axios";

export type SimulationType = "BRUTE_FORCE" | "PRIVILEGE_ESCALATION" | "DDOS";

export interface SimulationRequestDTO {
  type: SimulationType;
  intensity: number;
  durationSeconds: number;
  target?: string;
}

export interface SimulationTimelinePointDTO {
  timestamp: string;
  count: number;
}

export interface SimulationResponseDTO {
  id: string;
  type: SimulationType;
  status: "RUNNING" | "STOPPED" | "COMPLETED" | "FAILED";
  intensity: number;
  durationSeconds: number;
  target?: string;
  startedAt: string;
  endedAt?: string;
  eventsGenerated: number;
  timeline: SimulationTimelinePointDTO[];
}

export class SimulatorGatewayService {
  private readonly client: AxiosInstance;

  constructor(baseUrl?: string) {
    const internalHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const adminKey = process.env.SIMULATOR_ADMIN_KEY;
    if (adminKey && adminKey.trim().length > 0) {
      internalHeaders["x-simulator-admin-key"] = adminKey.trim();
    }

    this.client = axios.create({
      baseURL: baseUrl,
      headers: internalHeaders,
      timeout: 10000,
    });
  }

  async startSimulation(payload: SimulationRequestDTO): Promise<SimulationResponseDTO> {
    const response = await this.client.post<SimulationResponseDTO>("/simulator/start", payload);
    return response.data;
  }

  async stopSimulation(id: string): Promise<SimulationResponseDTO> {
    const response = await this.client.post<SimulationResponseDTO>(`/simulator/${id}/stop`);
    return response.data;
  }

  async getSimulation(id: string): Promise<SimulationResponseDTO> {
    const response = await this.client.get<SimulationResponseDTO>(`/simulator/${id}`);
    return response.data;
  }

  async listSimulations(): Promise<SimulationResponseDTO[]> {
    const response = await this.client.get<SimulationResponseDTO[]>("/simulator");
    return response.data;
  }
}
