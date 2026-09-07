import { FirewallRuleDTO } from "./FirewallRuleDTO";

export interface PaginatedFirewallRulesDTO {
    data: FirewallRuleDTO[];
    total: number;
    page: number;
}
