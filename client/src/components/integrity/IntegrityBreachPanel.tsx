import { IoClose } from "react-icons/io5";
import { FiAlertTriangle } from "react-icons/fi";
import { IntegrityBreachPanelProps } from "../../types/props/integrity/IntegrityBreachPanelProps";

export default function IntegrityBreachPanel({ compromisedLogs, onClose }: IntegrityBreachPanelProps) {
   return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-[1000]"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl w-[95%] max-w-[800px] max-h-[85vh] overflow-hidden border border-red-300 shadow-[0_0_50px_rgba(220,38,38,0.1)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-red-50">
                    <div className="flex items-center gap-2 text-red-600">
                        <FiAlertTriangle size={20} />
                        <h2 className="m-0 text-lg font-bold uppercase tracking-tight">Security Breach Report</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-800 text-2xl transition-colors p-0 flex items-center"
                    >
                        <IoClose />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
                    <p className="text-gray-500 text-sm mb-6">
                        Sledeći unosi u bazi podataka se ne poklapaju sa kriptografskim hash lancem. 
                        Ovo ukazuje na direktnu manipulaciju bazom podataka.
                    </p>

                    <div className="space-y-4">
                        {compromisedLogs && compromisedLogs.length > 0 ? (
                            compromisedLogs.map((log, index) => (
                                <div 
                                    key={index} 
                                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:border-red-300 transition-all"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${log.isMissing ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"}`}>
                                                {log.isMissing ? "Deleted Entry" : "Data Tampered"}
                                            </span>
                                            <span className="text-gray-800 font-mono font-bold text-sm">Log ID: #{log.id || 'N/A'}</span>
                                        </div>
                                        <div className="text-gray-500 text-[13px] italic line-clamp-1 pr-4">
                                            "{log.description || "Historical data damaged or modified"}"
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-[10px] text-gray-400 uppercase font-semibold">Incident Detected</div>
                                        <div className="text-gray-700 text-xs font-mono">
                                            {new Date().toLocaleString("en-GB")}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400 italic">
                                No specific logs identified. Check system sync.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold text-[13px] hover:bg-gray-300 transition-all border border-gray-300"
                    >
                        Dismiss Warning
                    </button>
                </div>
            </div>
        </div>
    );
}