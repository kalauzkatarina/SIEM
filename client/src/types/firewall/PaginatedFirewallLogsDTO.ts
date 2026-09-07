import { FirewallLogDTO } from "./FirewallLogDTO";

export interface PaginatedFirewallLogsDTO {
    data: FirewallLogDTO[];
    total: number;
    page: number;
}
