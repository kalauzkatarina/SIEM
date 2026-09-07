import { FirewallModeDTO } from "../../types/firewall/FirewallModeDTO";
import { FirewallRuleDTO } from "../../types/firewall/FirewallRuleDTO";
import { FirewallTestDTO } from "../../types/firewall/FirewallTestDTO";
import { PaginatedFirewallLogsDTO } from "../../types/firewall/PaginatedFirewallLogsDTO";
import { PaginatedFirewallRulesDTO } from "../../types/firewall/PaginatedFirewallRulesDTO";

export interface IFirewallAPI {
    getAllRules(page: number, limit: number): Promise<PaginatedFirewallRulesDTO>
    addRule(ipAddress: string, port: number): Promise<FirewallRuleDTO>;
    deleteRule(id: number): Promise<{ success: boolean }>;

    getMode(): Promise<FirewallModeDTO>;
    setMode(mode: "WHITELIST" | "BLACKLIST"): Promise<FirewallModeDTO & { success: boolean }>;

    testConnection(ipAddress: string, port: number): Promise<FirewallTestDTO>;

    getAllLogs(page: number, limit: number): Promise<PaginatedFirewallLogsDTO>;
}