import axios, { AxiosInstance, AxiosResponse } from "axios";
import { FirewallRuleDTO } from "../../types/firewall/FirewallRuleDTO";
import { FirewallModeDTO } from "../../types/firewall/FirewallModeDTO";
import { FirewallTestDTO } from "../../types/firewall/FirewallTestDTO";
import { IFirewallAPI } from "./IFirewallAPI";
import { PaginatedFirewallLogsDTO } from "../../types/firewall/PaginatedFirewallLogsDTO";
import { PaginatedFirewallRulesDTO } from "../../types/firewall/PaginatedFirewallRulesDTO";

export class FirewallAPI implements IFirewallAPI {
    private readonly axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_FIREWALL_URL,
            headers: { "Content-Type": "application/json" },
            timeout: 30000,
        });
    }

    // =============== RULES ===============
    async getAllRules(page: number, limit: number): Promise<PaginatedFirewallRulesDTO> {
        const response: AxiosResponse = await this.axiosInstance.get("/firewall/rules", {
            params: {
                page,
                limit,
            },
        });

        return response.data;
    }

    async addRule(ipAddress: string, port: number): Promise<FirewallRuleDTO> {
        const response: AxiosResponse = await this.axiosInstance.post("/firewall/rules", { ipAddress, port });
        return response.data;
    }

    async deleteRule(id: number): Promise<{ success: boolean }> {
        const response: AxiosResponse = await this.axiosInstance.delete(`/firewall/rules/${id}`);
        return response.data;
    }

    // =============== MODE ===============
    async getMode(): Promise<FirewallModeDTO> {
        const response: AxiosResponse = await this.axiosInstance.get("/firewall/mode");
        return response.data;
    }

    async setMode(mode: "WHITELIST" | "BLACKLIST"): Promise<FirewallModeDTO & { success: boolean }> {
        const response: AxiosResponse = await this.axiosInstance.put("/firewall/mode", { mode });
        return response.data;
    }

    // =============== TEST CONNECTION ===============
    async testConnection(ipAddress: string, port: number): Promise<FirewallTestDTO> {
        const response: AxiosResponse = await this.axiosInstance.get("/firewall/testConnection", {
            params: { ipAddress, port },
        });
        return response.data;
    }

    // =============== LOGS ===============
    async getAllLogs(page: number, limit: number): Promise<PaginatedFirewallLogsDTO> {
        const response: AxiosResponse<PaginatedFirewallLogsDTO> =
            await this.axiosInstance.get("/firewall/logs", {
                params: { page, limit },
            });

        return response.data;
    }

}