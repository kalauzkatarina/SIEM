import type { EventDTO } from "./EventDTO";

export interface CompromisedLogDTO {
    event: EventDTO;          // Originalni podaci iz MySQL event tabele
    storedHash: string;       // Hash koji imamo u integrity_db
    calculatedHash: string;   // Hash koji smo dobili ponovnim računanjem (ako se razlikuju)
    isMissing: boolean;       // Ako je log potpuno obrisan iz MySQL-a
    detectedAt: Date;
}