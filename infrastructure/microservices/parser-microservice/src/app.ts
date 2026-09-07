import express from 'express';
import cors from 'cors';
import "reflect-metadata";
import { initialize_database } from './Database/InitializeConnection';
import dotenv from 'dotenv';
import { Repository } from 'typeorm';
import { Db } from './Database/DbConnectionPool';
import { ParserEvent } from './Domain/models/ParserEvent';
import { IParserService } from './Domain/services/IParserService';
import { ParserService } from './Services/ParserService';
import { ParserController } from './WebAPI/controllers/ParserController';
import { IParserRepositoryService } from './Domain/services/IParserRepositoryService';
import { ParserRepositoryService } from './Services/ParserRepositoryService';
import { ILogerService } from './Domain/services/ILogerService';
import { LogerService } from './Services/LogerService';

dotenv.config({ quiet: true });

const app = express();

// Read CORS settings from environment
const corsOrigin = process.env.CORS_ORIGIN?.split(",").map(m => m.trim()) ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map(m => m.trim()) ?? ["POST"];

// Protected microservice from unauthorized access
app.use(cors({
  origin: corsOrigin,
  methods: corsMethods,
}));

app.use(express.json());

initialize_database();

app.get("/health", async (req, res) => {
  try {
    // Provera baze
    await Db.query("SELECT 1");

    res.status(200).json({
      status: "OK",
      service: "ParserService", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (err) {
    // Ako baza padne, ceo status je DOWN sa kodom 503
    res.status(503).json({
      status: "DOWN",
      service: "ParserService",
      timestamp: new Date().toISOString()
    });
  }
});

// ORM Repositories
const parserEventRepository: Repository<ParserEvent> = Db.getRepository(ParserEvent);

// Validators


// Services
const logger: ILogerService = new LogerService();
const parserService: IParserService = new ParserService(parserEventRepository, logger);
const parserRepositoryService: IParserRepositoryService = new ParserRepositoryService(parserEventRepository, logger);

// WebAPI routes
const parserController = new ParserController(parserService, parserRepositoryService, logger);

// Registering routes
app.use('/api/v1', parserController.getRouter());

export default app;
