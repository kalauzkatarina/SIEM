export interface IntegrityStatusDTO {
    isChainValid: boolean; // Da li je ceo lanac netaknut
    lastChecked: Date;     // Kada je urađena poslednja provera
    totalLogsChecked: number;
    compromisedSegmentsCount: number; // Broj pronađenih grešaka
}