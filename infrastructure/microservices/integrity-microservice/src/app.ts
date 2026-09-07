import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import dotenv from 'dotenv';
import { IntegrityDb, EventDb } from './Database/DbConnectionPool';
import { Repository } from 'typeorm';
import { IntegrityLog } from './Domain/models/IntegrityLog';
import { Event } from './Domain/models/Event';
import { IntegrityService } from './Services/IntegrityService';
import { IntegrityController } from './WebAPI/controllers/IntegrityController';

dotenv.config({ quiet: true });

const app = express();

// Parsiranje JSON body-ja
app.use(express.json());

// CORS podešavanje iz .env
const corsOrigin =
  process.env.CORS_ORIGIN?.split(",").map((m) => m.trim()) ?? ["*"];

const corsMethods =
  process.env.CORS_METHODS?.split(",").map((m) => m.trim()) ??
  ["GET", "POST", "DELETE", "OPTIONS"];

app.use(
  cors({
    origin: corsOrigin,
    methods: corsMethods,
  }),
);

// Inicijalizacija obe baze podataka
void (async () => {
  try {
    await IntegrityDb.initialize();
    console.log("\x1b[34m[IntegrityDb]\x1b[0m Connected");
    
    await EventDb.initialize();
    console.log("\x1b[34m[EventDb]\x1b[0m Connected (Read-Only Access)");
  } catch (error) {
    console.error("\x1b[31m[DbError]\x1b[0m Failed to connect to databases:", error);
  }
})();

// Health Check ruta
app.get("/health", async (req, res) => {
  try {
    await IntegrityDb.query("SELECT 1");
    res.status(200).json({
      status: "OK",
      service: "IntegrityService",
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(503).json({
      status: "DOWN",
      service: "IntegrityService",
      timestamp: new Date().toISOString()
    });
  }
});

// ORM Repositories (Svaki iz svoje baze!)
const integrityRepository: Repository<IntegrityLog> = IntegrityDb.getRepository(IntegrityLog);
const eventRepository: Repository<Event> = EventDb.getRepository(Event);

// Servis (Prima oba repozitorijuma)
const integrityService = new IntegrityService(integrityRepository, eventRepository);

// WebAPI Kontroler (Napravićemo ga u sledećem koraku)
const integrityController = new IntegrityController(integrityService);

// Registracija ruta na /api/v1/integrity
app.use('/api/v1/integrity', integrityController.getRouter());

export default app;