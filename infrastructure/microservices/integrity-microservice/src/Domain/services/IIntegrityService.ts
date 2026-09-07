import type { IntegrityStatusDTO } from "../DTOs/IntegrityStatusDTO";
import type { CompromisedLogDTO } from "../DTOs/CompromisedLogDTO";

export interface IIntegrityService {
    /*
     * Preuzima nove eventove iz MySQL-a koji još nemaju hash i vezuje ih u lanac.
     * Implementira: "Za svaki bezbednosni događaj generiše hash i vezuje ih u hash chain".
     */
    initializeHashChain(): Promise<void>;

    /**
     * Prolazi kroz postojeći lanac i upoređuje sačuvane heševe sa novim proračunom.
     * Implementira: "Periodično proverava integritet lanaca".
     */
    verifyAllLogs(): Promise<IntegrityStatusDTO>;

    /**
     * Vraća podatke za Electron aplikaciju.
     * Implementira: "Pregled kompromitovanih zapisa (read-only)".
     */
    getCompromisedLogs(): Promise<CompromisedLogDTO[]>;

    getAllHashes(): Promise<{ eventId: number; hash: string }[]>;

    /**
     * Poziva se kada verifyAllLogs() pronađe nepravilnost.
     * Implementira: "Generiše Critical Alert i obeležava kompromitovani segment".
     */
    handleIntegrityViolation(eventId: number, reason: string): Promise<void>;
}