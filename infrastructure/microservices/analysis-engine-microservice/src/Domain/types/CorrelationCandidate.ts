import { CorrelationCategory } from "../enums/CorrelationCategory";
export interface CorrelationCandidate {
  readonly correlationDetected: boolean;
  readonly description: string;
  readonly confidence: number;
  readonly severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  readonly category: CorrelationCategory;
  readonly correlatedEventIds: number[];
}