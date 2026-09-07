import { MostEventType } from "../types/events/MostEventType";

export function calculateMostEventType(infoCount: number, errorCount: number, warningCount: number): MostEventType {
    const array = [infoCount, errorCount, warningCount];
    const max = Math.max(...array);
    if (max === infoCount) {
        return { max, type: "Info" };
    }
    
    if (max === errorCount) {
        return { max, type: "Error" };
    }

    return { max, type: "Warning" };

}