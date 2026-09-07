import { ValidationResult } from "../../Domain/types/ValidationResult";

export function ValidateIpAndPort(ipAddress: string, port: number): ValidationResult {
    if (!ipAddress || typeof ipAddress !== "string") {
        return {
            success: false,
            message: "Invalid input: 'ipAddress' must be a non-empty string!"
        };
    }

    if (!port || typeof port !== "number") {
        return {
            success: false,
            message: "Invalid input: 'port' must be a valid number!"
        };
    }

    // IP format (IPv4)
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ipAddress.trim())) {
        return {
            success: false,
            message: "Invalid IP address format!"
        };
    }

    if (port < 1 || port > 65535) {
        return {
            success: false,
            message: "Port must be between 1 and 65535!"
        };
    }

    if (ipAddress.trim().length > 45) {
        return {
            success: false,
            message: "IP address exceeds maximum length (45 chars)!"
        };
    }

    return { success: true };
}