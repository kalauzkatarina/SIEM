import { useEffect, useState } from "react";

import FirewallModeSwitcher from "../firewall/FirewallModeSwitcher";
import FirewallRuleManager from "../firewall/FirewallRuleManager";
import FirewallRulesTable from "../firewall/FirewallRulesTable";
import FirewallLogsTable from "../firewall/FirewallLogsTable";
import FirewallConnectionTester from "../firewall/FirewallConnectionTester";
import { IFirewallAPI } from "../../api/firewall/IFirewallAPI";
import { FirewallModeDTO } from "../../types/firewall/FirewallModeDTO";
import { FirewallRuleDTO } from "../../types/firewall/FirewallRuleDTO";
import { FirewallLogDTO } from "../../types/firewall/FirewallLogDTO";
import Pagination from "../common/Pagination";

interface FirewallViewProps {
    firewallApi: IFirewallAPI;
}

export default function Firewall({ firewallApi }: FirewallViewProps) {
    const [mode, setMode] = useState<FirewallModeDTO>({ mode: "WHITELIST" });
    const [rules, setRules] = useState<FirewallRuleDTO[]>([]);
    const [logs, setLogs] = useState<FirewallLogDTO[]>([]);

    const [logsPage, setLogsPage] = useState<number>(1);
    const [logsPageSize, setLogsPageSize] = useState<number>(50);
    const [logsTotalItems, setLogsTotalItems] = useState<number>(0);

    const [rulesPage, setRulesPage] = useState(1);
    const [rulesPageSize, setRulesPageSize] = useState(10);
    const [rulesTotalItems, setRulesTotalItems] = useState(0);

    const logsTotalPages = Math.ceil(logsTotalItems / logsPageSize);

    // Load initial data
    const loadInitialData = async () => {
        try {
            const fMode = await firewallApi.getMode();
            setMode(fMode);

            await Promise.all([
                loadFirewallLogs(1, logsPageSize),
                loadFirewallRules(1, rulesPageSize),
            ]);
        } catch (err) {
            console.error("Failed to load firewall data", err);
        }
    };

    const loadFirewallLogs = async (
        targetPage: number = logsPage,
        limit: number = logsPageSize
    ) => {
        try {
            const response = await firewallApi.getAllLogs(targetPage, limit);

            setLogs(response.data);
            setLogsTotalItems(response.total);
            setLogsPage(response.page);
        } catch (err) {
            console.error("Failed to load firewall logs", err);
        }
    };

    const loadFirewallRules = async (page = rulesPage, size = rulesPageSize) => {
        try {
            const response = await firewallApi.getAllRules(page, size);

            setRules(response.data);
            setRulesTotalItems(response.total);
            setRulesPage(response.page);
        } catch (err) {
            console.error("Failed to load firewall rules", err);
        }
    };

    useEffect(() => {
        void loadInitialData();
    }, []);

    // Handlers for subcomponents
    const handleModeSave = async (newMode: "WHITELIST" | "BLACKLIST") => {
        try {
            const updated = await firewallApi.setMode(newMode);
            setMode({ mode: updated.mode });
        } catch (err) {
            console.error("Failed to update mode", err);
        }
    };

    const handleAddRule = async (ip: string, port: number) => {
        try {
            const newRule = await firewallApi.addRule(ip, port);
            setRules((prev) => [...prev, newRule]);
        } catch (err) {
            console.error("Failed to add rule", err);
            throw err;      // Propagate error for component to show
        }
    };

    const handleDeleteRule = async (id: number) => {
        try {
            await firewallApi.deleteRule(id);
            setRules((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Failed to delete rule", err);
        }
    };

    const handleTestConnection = async (ip: string, port: number) => {
        return await firewallApi.testConnection(ip, port);
    };

    return (
        <div className="p-6 flex flex-col gap-3">

            {/* Row 1: Firewall Mode (full width) */}
            <div className="flex flex-col justify-center items-center min-h-[180px] rounded-lg border-2 border-[#282A28] bg-[#1f2123] p-6">
                <FirewallModeSwitcher
                    mode={mode}
                    onSave={handleModeSave}
                />
            </div>

            {/* Row 2: Add Rule + Test Connection */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                <div className="flex flex-col justify-center items-center min-h-[320px] rounded-lg border-2 border-[#282A28] bg-[#1f2123] p-6">
                    <FirewallRuleManager
                        addRule={handleAddRule}
                    />
                </div>

                <div className="flex flex-col justify-center items-center min-h-[320px] rounded-lg border-2 border-[#282A28] bg-[#1f2123] p-6">
                    <FirewallConnectionTester
                        testConnection={handleTestConnection}
                    />
                </div>
            </div>

            {/* Row 3: Firewall Rules + Logs */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                <div className="flex flex-col h-[440px] rounded-lg border-2 border-[#282A28] bg-[#1f2123]">
                    <div className="flex-1 overflow-auto px-2">
                        <FirewallRulesTable
                            rules={rules}
                            deleteRule={handleDeleteRule}
                        />
                    </div>

                    <div className="border-t border-[#3a3a3a] bg-[#1f2123]">
                        <Pagination
                            currentPage={rulesPage}
                            totalPages={Math.ceil(rulesTotalItems / rulesPageSize)}
                            pageSize={rulesPageSize}
                            totalItems={rulesTotalItems}
                            onPageChange={(newPage) => {
                                setRulesPage(newPage);
                                loadFirewallRules(newPage, rulesPageSize);
                            }}
                            onPageSizeChange={(newSize) => {
                                setRulesPageSize(newSize);
                                setRulesPage(1);
                                loadFirewallRules(1, newSize);
                            }}
                        />
                    </div>
                </div>


                <div className="flex flex-col h-[440px] rounded-lg border-2 border-[#282A28] bg-[#1f2123]">
                    <div className="flex-1 overflow-auto px-2">
                        <FirewallLogsTable logs={logs} />
                    </div>

                    <div className="border-t border-[#3a3a3a] bg-[#1f2123]">
                        <Pagination
                            currentPage={logsPage}
                            totalPages={logsTotalPages}
                            pageSize={logsPageSize}
                            totalItems={logsTotalItems}
                            onPageChange={(newPage) => {
                                setLogsPage(newPage);
                                loadFirewallLogs(newPage, logsPageSize);
                            }}
                            onPageSizeChange={(newSize) => {
                                setLogsPageSize(newSize);
                                setLogsPage(1);
                                loadFirewallLogs(1, newSize);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}