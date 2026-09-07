import express from "express";
import cors from "cors";
import "reflect-metadata";
import dotenv from "dotenv";
import { Repository } from "typeorm";
import { initialize_mysql_database } from "./Database/InitializeConnection";
import { MySQLDb } from "./Database/DbConnectionPool";
import { ILoggerService } from "./Domain/services/ILoggerService";
import { LoggerService } from "./Services/LoggerService";
import { RiskScoringController } from "./WebAPI/controllers/RiskScoringController";
import { IRiskScoreService } from "./Domain/services/IRiskScoreService";
import { RiskScoreService } from "./Services/RiskScoreService";
import { SecurityMetrics } from "./Domain/models/SecurityMetrics";

dotenv.config({ quiet: true });

// App initialization
const app = express();

// CORS Configuration
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map(m => m.trim()) ?? ["GET", "POST", "PUT", "DELETE"];

app.use(cors({ origin: corsOrigin, methods: corsMethods }));
app.use(express.json());

// Database Initialization
initialize_mysql_database();

// --- HEALTH CHECK
app.get("/health", async (req, res) => {
  try {
    if (MySQLDb.isInitialized) {
        await MySQLDb.query("SELECT 1");
    } else {
        throw new Error("Database not initialized");
    }

    res.status(200).json({
      status: "OK",
      service: "RiskScoreService",
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(503).json({
      status: "DOWN",
      service: "RiskScoreService",
      timestamp: new Date().toISOString(),
      error: err instanceof Error ? err.message : "Database connection failed"
    });
  }
});

const riskScoreRepository: Repository<SecurityMetrics> = MySQLDb.getRepository(SecurityMetrics);
// Repository

// Services
const loggerService: ILoggerService = new LoggerService();
const riskScoreService: IRiskScoreService = new RiskScoreService(loggerService, riskScoreRepository)

// Controllers
const riskScoringController = new RiskScoringController(riskScoreService);

// Routing
app.use("/api/v1", riskScoringController.getRouter());

// 3_600_000 za svaki sat
// 10_000 za svakih 10 sekundi -> previse cesto
// 600_000 za svakih 10 minuta

setInterval(() => {
    riskScoreService.calculateAll();
}, 600_000); // poziva se na 10 minuta

export default app;
