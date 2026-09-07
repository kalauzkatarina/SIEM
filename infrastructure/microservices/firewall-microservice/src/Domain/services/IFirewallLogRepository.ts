import { FirewallLogDTO } from "../DTOs/FirewallLogDTO";

export interface IFirewallLogRepository {
    add(ipAddress: string, port: number, decision: "ALLOWED" | "BLOCKED", mode: "WHITELIST" | "BLACKLIST"): Promise<void>;
    getAll(): Promise<FirewallLogDTO[]>;
    getPaginated(page: number, limit: number): Promise<{ data: FirewallLogDTO[]; total: number; page: number; }>
}
