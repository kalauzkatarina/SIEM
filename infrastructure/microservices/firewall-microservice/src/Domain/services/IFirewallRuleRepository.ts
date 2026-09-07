import { FirewallRuleDTO } from "../DTOs/FirewallRuleDTO";

export interface IFirewallRuleRepository {
    getAll(): Promise<FirewallRuleDTO[]>;
    getPaginated(page: number, limit: number): Promise<{ data: FirewallRuleDTO[]; total: number; page: number; }>
    getByIpAndPort(ipAddress: string, port: number): Promise<FirewallRuleDTO>;
    add(ipAddress: string, port: number): Promise<FirewallRuleDTO>;
    deleteById(id: number): Promise<boolean>;
}