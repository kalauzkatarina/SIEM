import { ParserEventDTO } from "../DTOs/ParserEventDTO";

export interface IParserRepositoryService {
    getAll(): Promise<ParserEventDTO[]>;
    getParserEventById(id: number): Promise<ParserEventDTO>;
    deleteById(id: number): Promise<boolean>;
}