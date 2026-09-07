import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuthHook";
import { IIntegrityAPI } from "../../api/integrity/IIntegrityAPI";
import { IntegrityStatusDTO } from "../../models/integrity/IntegrityStatusDTO";
import IntegrityStatusCard from "../integrity/IntegrityStatusCard";

interface IntegrityProps {
    integrityApi: IIntegrityAPI;
    queryApi: any;
}

export default function Integrity({ integrityApi, queryApi }: IntegrityProps) {
    const { token: authToken } = useAuth();

    const [status, setStatus] = useState<IntegrityStatusDTO | null>(null);
    const [compromisedLogs, setCompromisedLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allEvents, setAllEvents] = useState<any[]>([]);
    const [showOnlyErrors, setShowOnlyErrors] = useState<boolean>(false);
    const [hashMap, setHashMap] = useState<Record<number, string>>({});

    const fetchHashes = useCallback(async () => {
        if (!authToken) return;

        try {
            const rawRes: any = await integrityApi.getAllHashes(authToken);

            // Iskrače niz bez obzira na to da li stiže kao rawRes, rawRes.data, rawRes.hashes ili rawRes.response
            const hashesArray = Array.isArray(rawRes)
                ? rawRes
                : Array.isArray(rawRes?.data)
                    ? rawRes.data
                    : Array.isArray(rawRes?.hashes)
                        ? rawRes.hashes
                        : Array.isArray(rawRes?.response)
                            ? rawRes.response
                            : [];

            const map: Record<number, string> = {};

            hashesArray.forEach((h: { eventId: number; hash: string }) => {
                if (h && h.eventId !== undefined) {
                    map[Number(h.eventId)] = h.hash;
                }
            });

            setHashMap(map);
        } catch (err) {
            console.error("Greska pri dohvatanju heseva:", err);
        }
    }, [authToken, integrityApi]);

    const handleRunAudit = async () => {
        if (!authToken) return;

        try {
            setIsLoading(true);
            setCompromisedLogs([]);
            setAllEvents([]);

            
            const rawRes: any = await integrityApi.verifyLogs(authToken);
            const res = rawRes.response || rawRes;
            
            await fetchHashes();
            try {
                const eventsRes = await queryApi.getEventsByQuery("", authToken, 1, 2000);
                if (eventsRes && eventsRes.data) {
                    const sortedData = [...eventsRes.data].sort((a, b) => Number(b.id) - Number(a.id));
                    setAllEvents(sortedData);
                }
            } catch (e) {
                console.error("Greška pri učitavanju tabele:", e);
            }

            setStatus({
                isChainValid: res.isChainValid,
                totalLogsChecked: res.totalLogsChecked || 0,
                lastChecked: new Date(),
                compromisedSegmentsCount: res.isChainValid ? 0 : (res.compromisedSegmentsCount || 0)
            });

            if (res.isChainValid === false) {
                const realCompromisedRaw: any = await integrityApi.getCompromisedLogs(authToken);
                const logs = Array.isArray(realCompromisedRaw)
                    ? realCompromisedRaw
                    : (realCompromisedRaw.response || []);
                setCompromisedLogs(logs);
            }

        } catch (err) {
            console.error("Audit neuspešan:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (authToken) {
            void handleRunAudit();
        }
    }, [authToken]);

    const isRowCompromised = (ev: any) => {
        return compromisedLogs.some(log => {
            const badId = log?.event?.id || log?.id || log;
            return String(badId) === String(ev.id);
        });
    };

    const displayedEvents = [...allEvents]
        .sort((a, b) => {
            const aComp = isRowCompromised(a);
            const bComp = isRowCompromised(b);

            if (aComp && !bComp) return -1;
            if (!aComp && bComp) return 1;

            return Number(b.id) - Number(a.id);
        })
        .filter(ev => showOnlyErrors ? isRowCompromised(ev) : true);

    return (
        <div className="p-6 flex flex-col gap-3 bg-[#f5f5f5]">
            <div className="flex flex-col justify-center items-center min-h-[180px] rounded-lg border-2 border-gray-300 bg-[#f5f5f5] p-6">
                <div className="w-full flex justify-between items-center mb-4">
                    <h2 className="mt-[3px]! p-[5px]! m-[10px]! text-gray-800">
                        Blockchain Integrity Control
                    </h2>

                    <div
                        className={`flex items-center gap-2! px-4! py-1.5! mr-2! rounded-[8px] text-[12px] font-semibold
                        ${status?.isChainValid !== false
                                ? "bg-[rgba(74,222,128,0.15)] text-[#16a34a] border border-[rgba(74,222,128,0.3)]"
                                : "bg-[rgba(239,68,68,0.15)] text-[#dc2626] border border-[rgba(239,68,68,0.3)]"
                            }`}
                    >
                        <div
                            className={`w-2 h-2 rounded-full
                            ${isLoading
                                    ? "bg-[#eab308] animate-pulse"
                                    : status?.isChainValid !== false
                                        ? "bg-[#4ade80] animate-pulse"
                                        : "bg-[#f87171]"
                                }`}
                        />
                        {isLoading
                            ? "Running Audit..."
                            : status?.isChainValid !== false
                                ? "System Secure"
                                : "Integrity Breach"}
                    </div>
                </div>

                <IntegrityStatusCard
                    status={status}
                    onVerify={handleRunAudit}
                    loading={isLoading}
                />
            </div>

            <div className="flex flex-col h-[600px] rounded-lg border-2 border-gray-300 bg-[#f5f5f5]">
                <div className="flex justify-between items-center bg-[#f5f5f5] px-6! py-4! border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                            Live Database Feed
                        </span>
                        <button
                            onClick={() => setShowOnlyErrors(!showOnlyErrors)}
                            className={`text-xs px-3 py-1 rounded border font-bold transition-all
                            ${showOnlyErrors
                                    ? "bg-red-600 border-red-700 text-white"
                                    : "bg-white border-gray-300 text-gray-500 hover:border-gray-500"
                                }`}
                        >
                            {showOnlyErrors
                                ? "Showing Only Breaches"
                                : "Filter Breaches"}
                        </button>
                    </div>
                    <span className="text-xs text-[#0a84ff] font-mono italic">
                        Syncing {allEvents.length} records...
                    </span>
                </div>

                <div className="flex-1 overflow-auto px-5! mt-2! ">
                    <div className="rounded-xl overflow-hidden border border-gray-300">
                        <table className="w-full table-fixed border-collapse text-sm">
                            <thead className="bg-gray-50 sticky top-0 z-10 ">
                                <tr>
                                    <th className="w-1/5 px-4! py-3! text-center text-gray-500 font-semibold text-[13px] border-b border-gray-200 uppercase tracking-[0.5px]">
                                        ID
                                    </th>
                                    <th className="w-1/5 px-4! py-3! text-center text-gray-500 font-semibold text-[13px] border-b border-gray-200 uppercase tracking-[0.5px]">
                                        Timestamp
                                    </th>
                                    <th className="w-1/5 px-4! py-3! text-center text-gray-500 font-semibold text-[13px] border-b border-gray-200 uppercase tracking-[0.5px]">
                                        Type
                                    </th>
                                    <th className="w-1/5 px-4! py-3! text-center text-gray-500 font-semibold text-[13px] border-b border-gray-200 uppercase tracking-[0.5px]">
                                        Integrity
                                    </th>
                                    <th className="w-1/5 px-4! py-3! text-center text-gray-500 font-semibold text-[13px] border-b border-gray-200 uppercase tracking-[0.5px]">
                                        Digital Signature
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {displayedEvents.length === 0 && !isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-12 text-center text-gray-500 border-b border-gray-200">
                                            No database records found
                                        </td>
                                    </tr>
                                ) : (
                                    displayedEvents.map((ev, i) => {
                                        const compromised = isRowCompromised(ev);
                                        const hashValue = hashMap[Number(ev.id)];
                                        return (
                                            <tr key={ev.id || i} className="transition-colors duration-200 hover:bg-gray-50">
                                                <td className={`px-4! py-3! text-center border-b border-gray-200 font-mono text-[14px] ${compromised ? "text-red-600" : "text-gray-800"}`}>
                                                    #{ev.id} {compromised && "⚠️"}
                                                </td>
                                                <td className="px-4! py-3! text-center border-b border-gray-200 text-gray-600 font-mono text-[14px]">
                                                    {ev.timestamp ? new Date(ev.timestamp).toLocaleString("en-GB") : "---"}
                                                </td>
                                                <td className={`px-4! py-3! text-center border-b border-gray-200 font-mono text-[14px] ${compromised ? "text-red-600" : "text-gray-500"}`}>
                                                    {ev.eventType || "LOG"}
                                                </td>
                                                <td className="px-4! py-3! text-center border-b border-gray-200 font-mono text-[14px]">
                                                    {compromised ? (
                                                        <span className="text-red-600 animate-pulse">CORRUPTED</span>
                                                    ) : (
                                                        <span className="text-green-600 opacity-80">VERIFIED</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center border-b border-gray-200 text-gray-600 font-mono text-[13px] relative group cursor-pointer">
    {/* Osnovni skraćeni prikaz */}
    <span className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors border border-gray-200">
        {hashValue ? `${hashValue.substring(0, 24)}...` : "0x00000000"}
    </span>

    {/* Tooltip na hover koji prikazuje puni SHA-256 hash */}
    {hashValue && (
        <div className="absolute z-50 hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-[11px] font-mono rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
            {hashValue}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
    )}
</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}