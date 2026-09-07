import { useState } from "react";
import { FirewallTestDTO } from "../../types/firewall/FirewallTestDTO";

interface FirewallConnectionTesterProps {
    testConnection: (ipAddress: string, port: number) => Promise<FirewallTestDTO>;
}

export default function FirewallConnectionTester({ testConnection }: FirewallConnectionTesterProps) {
    const [ipAddress, setIpAddress] = useState("");
    const [port, setPort] = useState<number | "">("");
    const [isTesting, setIsTesting] = useState(false);
    const [result, setResult] = useState<FirewallTestDTO | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTest = async () => {
        if (!ipAddress || port === "") {
            setError("Please enter valid IP and port.");
            setResult(null);
            return;
        }

        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipRegex.test(ipAddress.trim())) {
            setError("Invalid IP address format.");
            setResult(null);
            return;
        }

        const portNum = Number(port);
        if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
            setError("Port must be a number between 1 and 65535.");
            setResult(null);
            return;
        }

        setIsTesting(true);
        setError(null);
        setResult(null);

        try {
            const res = await testConnection(ipAddress, Number(port));
            setResult(res);
        } catch (err) {
            console.error("Connection test failed", err);
            setError("Connection test failed.");
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 justify-center items-center gap-6 w-full max-w-sm">
            <h3 className="text-white text-lg font-semibold self-center">
                Test Connection
            </h3>

            <input
                type="text"
                placeholder="IP Address"
                value={ipAddress}
                required
                title="Enter valid IP address (e.g. 192.168.1.1)"
                onChange={(e) => setIpAddress(e.target.value)}
                className="w-full px-4 py-2 rounded-[10px] border-2 border-[#333] bg-[#1f1f1f] text-white placeholder:text-[#a6a6a6] focus:outline-none focus:border-[#007a55] transition-colors duration-200"
            />

            <input
                type="number"
                placeholder="Port"
                value={port}
                min="1"
                max="65535"
                required
                title="Port must be between 1 and 65535"
                onChange={(e) => setPort(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-4 py-2 rounded-[10px] border-2 border-[#333] bg-[#1f1f1f] text-white placeholder:text-[#a6a6a6] focus:outline-none focus:border-[#007a55] transition-colors duration-200"
            />

            <button
                onClick={handleTest}
                disabled={isTesting}
                className={`w-full px-5 py-2 rounded-[10px] text-white text-sm font-semibold transition-all duration-200 ${isTesting ? "bg-[#313338] cursor-not-allowed" : "bg-[#007a55] hover:bg-[#008b65]"
                    }`}
            >
                {isTesting ? "Testing..." : "Test"}
            </button>

            {result && (
                <div className={`font-semibold text-sm ${result.allowed ? "text-[#00ff88]" : "text-red-400"}`}>
                    {result.allowed ? "Allowed" : "Blocked"}
                </div>
            )}


            {error && (
                <div className="font-semibold text-sm text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
}