import { IntegrityStatusDTO } from "../DTOs/IntegrityStatusDTO";
import { CompromisedLogDTO } from "../DTOs/CompromisedLogDTO";

export interface IIntegrityGatewayService {
  initializeHashChain(): Promise<{ message: string }>;
  verifyLogs(): Promise<IntegrityStatusDTO>;
  getCompromisedLogs(): Promise<CompromisedLogDTO[]>;
  getAllHashes(): Promise<{ eventId: number; hash: string }[]>;
}