import { Repository } from "typeorm";
import { createHash } from "crypto";
import { IntegrityLog } from "../Domain/models/IntegrityLog";
import { Event } from "../Domain/models/Event";
import type { IIntegrityService } from "../Domain/services/IIntegrityService";
import type { IntegrityStatusDTO } from "../Domain/DTOs/IntegrityStatusDTO";
import type { CompromisedLogDTO } from "../Domain/DTOs/CompromisedLogDTO";

export class IntegrityService implements IIntegrityService {
    constructor(
        private readonly integrityRepository: Repository<IntegrityLog>,
        private readonly eventRepository: Repository<Event>
    ) { }

    private calculateSHA256(data: string): string {
        return createHash("sha256").update(data).digest("hex");
    }

    //formiranje hes lanca
    async initializeHashChain(): Promise<void> {
        // DODATO: where: {} da bi TypeORM znao da pretražuje sve
        const lastHashEntry = await this.integrityRepository.findOne({
            where: {},
            order: { eventId: "DESC" }
        });

        const startId = lastHashEntry ? lastHashEntry.eventId + 1 : 1;

        const newEvents = await this.eventRepository.createQueryBuilder("event")
            .where("event.id >= :startId", { startId })
            .orderBy("event.id", "ASC")
            .getMany();

        let previousHash = lastHashEntry ? lastHashEntry.hash : "0";

        for (const event of newEvents) {
            // Dodata provera za timestamp jer nekad može biti null
            const time = event.timestamp ? event.timestamp.getTime() : 0;
            const eventDataString = `${event.id}${event.source}${event.description}${time}`;
            const currentHash = this.calculateSHA256(eventDataString + previousHash);

            const newLogHash = this.integrityRepository.create({
                eventId: event.id,
                hash: currentHash,
                previousHash: previousHash,
                isCompromised: false
            });

            await this.integrityRepository.save(newLogHash);
            previousHash = currentHash;
        }
    }

    //provera integriteta
    async verifyAllLogs(): Promise<IntegrityStatusDTO> {
        const allHashes = await this.integrityRepository.find({ order: { eventId: "ASC" } });
        let compromisedCount = 0;

        for (const record of allHashes) {
            const originalEvent = await this.eventRepository.findOne({ where: { id: record.eventId } });

            //1. Детекција брисања догађаја
            if (!originalEvent) {
                if (!record.isCompromised) {
                    record.isCompromised = true;
                    await this.integrityRepository.save(record);
                    await this.handleIntegrityViolation(record.eventId, "LOG_DELETED");
                }
                compromisedCount++;
                continue;
            }

            //2. Детекција модификације података
            const time = originalEvent.timestamp ? originalEvent.timestamp.getTime() : 0;
            const eventDataString = `${originalEvent.id}${originalEvent.source}${originalEvent.description}${time}`;
            const recalculatedHash = this.calculateSHA256(eventDataString + record.previousHash);

            if (recalculatedHash !== record.hash) {
                if (!record.isCompromised) {
                    record.isCompromised = true;
                    await this.integrityRepository.save(record);
                    await this.handleIntegrityViolation(record.eventId, "DATA_MODIFIED");
                }
                compromisedCount++;
            }
        }

        return {
            isChainValid: compromisedCount === 0,
            lastChecked: new Date(),
            totalLogsChecked: allHashes.length,
            compromisedSegmentsCount: compromisedCount
        };
    }

    async getCompromisedLogs(): Promise<CompromisedLogDTO[]> {
        const compromisedEntries = await this.integrityRepository.find({
            where: { isCompromised: true },
            order: { eventId: "ASC" }
        });

        const results: CompromisedLogDTO[] = [];

        for (const entry of compromisedEntries) {
            const event = await this.eventRepository.findOne({ where: { id: entry.eventId } });

            const eventDto: any = event || { id: entry.eventId, description: "DELETED" };

            const time = event?.timestamp ? event.timestamp.getTime() : 0;
            const currentDataStr = event ? `${event.id}${event.source}${event.description}${time}` : "DELETED";
            const calculated = this.calculateSHA256(currentDataStr + entry.previousHash);

            results.push({
                event: eventDto,
                storedHash: entry.hash,
                calculatedHash: calculated,
                isMissing: !event,
                detectedAt: entry.createdAt
            } as any);
        }

        return results;
    }

    async getAllHashes(): Promise<{ eventId: number; hash: string }[]> {
        const all = await this.integrityRepository.find({ select: ["eventId", "hash"] });
        return all;
    }

    async handleIntegrityViolation(eventId: number, reason: string): Promise<void> {
        console.log(`\x1b[31m[CRITICAL ALERT]\x1b[0m Integrity breach on Event ID ${eventId}: ${reason}`);
    }
}