export interface EventDTO {
  source: string;
  type: "INFO" | "WARNING" | "ERROR";
  description: string;
  timestamp: string;
}
