import { ValidationResult } from "../../Domain/types/ValidationResult";

export function validateIntegrityCheckRequest(data: any): ValidationResult {
    // Ako klijent šalje opseg ID-eva za proveru
    if (data.fromId !== undefined && (!Number.isInteger(data.fromId) || data.fromId <= 0)) {
        return { success: false, message: "Invalid starting event ID" };
    }

    if (data.toId !== undefined && (!Number.isInteger(data.toId) || data.toId <= 0)) {
        return { success: false, message: "Invalid ending event ID" };
    }

    if (data.fromId && data.toId && data.fromId > data.toId) {
        return { success: false, message: "Starting ID must be lower than ending ID" };
    }

    return { success: true };
}