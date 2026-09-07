import { AlertDTO } from "../DTOs/AlertDTO";
import { AlertQueryDTO } from "../DTOs/AlertQueryDTO";
import { PaginatedAlertsDTO } from "../DTOs/PaginatedAlertsDTO";

export interface IAlertGatewayService {
  getAllAlerts(): Promise<AlertDTO[]>;
  getAlertById(id: number): Promise<AlertDTO>;
  searchAlerts(query: AlertQueryDTO): Promise<PaginatedAlertsDTO>;
  resolveAlert(id: number, resolvedBy: string, status: string): Promise<AlertDTO>;
  updateAlertStatus(id: number, status: string): Promise<AlertDTO>;
}