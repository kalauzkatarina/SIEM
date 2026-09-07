import { useState } from "react";
import { PiWarningOctagonFill, PiCheckCircleFill, PiCaretDownBold, PiCaretUpBold } from "react-icons/pi";
import { AiFillRobot } from "react-icons/ai";
import { IncidentTableProps } from "../../types/props/status-monitor/IncidentTableProps";

export default function IncidentTable({ incidents }: IncidentTableProps) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleRow = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const thClass = "px-4! py-3! text-center text-gray-500 font-semibold text-[13px] border-b border-gray-200 uppercase tracking-[0.5px]";
    const tdClass = "px-4! py-4! border-b border-gray-200 text-gray-700 text-[14px]";

    return (
        <div className="bg-white rounded-[14px] overflow-hidden border-2 border-gray-300 mt-6!">

            {/* Header */}
            <div className="flex items-center justify-between px-6! py-4! border-b-2 border-gray-300 bg-white">
                <div className="flex items-center gap-2">
                    <PiWarningOctagonFill className="text-[#dc2626]" size={22} />
                    <span className="text-gray-800 text-[16px] font-semibold m-0">Recent Incidents</span>
                </div>
                <div className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                    Live Monitoring
                </div>
            </div>

            <table className="w-full border-collapse text-left font-sans">
                <thead className="bg-gray-50">
                    <tr>
                        <th className={`${thClass} w-[5%]`}></th>
                        <th className={`${thClass} text-left w-[20%]`}>Service</th>
                        <th className={`${thClass} text-left w-[20%]`}>Time</th>
                        <th className={`${thClass} text-left w-[35%]`}>Reason</th>
                        <th className={`${thClass} w-[10%]`}>Status</th>
                        <th className={`${thClass} w-[10%]`}>Analysis</th>
                    </tr>
                </thead>

                <tbody>
                    {incidents.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-10! py-12! text-center border-b border-gray-200 text-gray-500">
                                <div className="flex flex-col items-center gap-2">
                                    <PiCheckCircleFill size={40} className="text-[#007a55] opacity-50" />
                                    <span>No active incidents. All systems operational.</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        incidents.map((incident) => {
                            const isExpanded = expandedId === incident.id;
                            const isResolved = !!incident.endTime;

                            return (
                                <>
                                    {/* Main Row */}
                                    <tr
                                        key={incident.id}
                                        onClick={() => toggleRow(incident.id)}
                                        className={`cursor-pointer transition-colors duration-200 border-b border-gray-200 ${isExpanded ? "bg-gray-50" : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <td className="px-4! py-4! text-center">
                                            {isResolved ? (
                                                <PiCheckCircleFill className="text-[#007a55]" size={22} />
                                            ) : (
                                                <PiWarningOctagonFill className="text-[#dc2626] animate-pulse" size={22} />
                                            )}
                                        </td>

                                        <td className={`${tdClass} font-bold text-gray-800`}>
                                            {incident.serviceName}
                                        </td>

                                        <td className={tdClass}>
                                            {formatDate(incident.startTime)}
                                        </td>

                                        <td className={`${tdClass} text-gray-600`}>
                                            {incident.reason}
                                        </td>

                                        <td className={tdClass}>
                                            <span
                                                className="px-2.5! py-1! rounded-[8px] text-[11px] font-bold border inline-block text-center min-w-[80px]"
                                                style={{
                                                    backgroundColor: isResolved
                                                        ? "rgba(0, 122, 85, 0.12)"
                                                        : "rgba(220, 38, 38, 0.12)",
                                                    color: isResolved ? "#007a55" : "#dc2626",
                                                    borderColor: isResolved
                                                        ? "rgba(0, 122, 85, 0.3)"
                                                        : "rgba(220, 38, 38, 0.3)",
                                                }}
                                            >
                                                {isResolved ? "RESOLVED" : "OPEN"}
                                            </span>
                                        </td>

                                        <td className="px-4! py-4! text-center text-gray-600">
                                            {isExpanded ? <PiCaretUpBold /> : <PiCaretDownBold />}
                                        </td>
                                    </tr>

                                    {/* Expanded Row */}
                                    {isExpanded && (
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <td colSpan={6} className="p-0">
                                                <div className="p-6! flex flex-col gap-4 border-l-4 border-[#7c3aed]">

                                                    {/* AI Analysis */}
                                                    <div className="flex gap-4">
                                                        <div className="mt-1">
                                                            <div className="bg-white p-2! rounded-full border border-gray-300">
                                                                <AiFillRobot className="text-[#7c3aed] text-2xl" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-[#7c3aed] text-[12px] font-bold uppercase mb-1! tracking-wider">
                                                                AI Correlation Analysis
                                                            </h4>
                                                            <div className="text-gray-700 text-[14px] leading-relaxed bg-white p-4! rounded-lg border border-gray-200">
                                                                {incident.correlationSummary || "Analysis is pending or not available for this incident."}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Technical Details */}
                                                    {incident.correlationRefs && (
                                                        <div className="ml-14! mt-2!">
                                                            <span className="text-[11px] text-gray-500 uppercase font-semibold tracking-wider">
                                                                Technical Context:
                                                            </span>
                                                            <div className="block mt-1! text-[11px] text-gray-600 bg-white p-3! rounded border border-gray-200">
                                                                {(() => {
                                                                    try {
                                                                        const data = JSON.parse(incident.correlationRefs);
                                                                        return (
                                                                            <div className="space-y-1">
                                                                                <div className="flex gap-2">
                                                                                    <span className="text-gray-500">Checks Analyzed:</span>
                                                                                    <span className="text-[#7c3aed] font-semibold">{data.checksAnalyzed}</span>
                                                                                </div>
                                                                                <div className="flex gap-2">
                                                                                    <span className="text-gray-500">Total Service History:</span>
                                                                                    <span className="text-[#7c3aed] font-semibold">{data.totalServiceHistory}</span>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    } catch (e) {
                                                                        return <code className="font-mono">{incident.correlationRefs}</code>;
                                                                    }
                                                                })()}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
