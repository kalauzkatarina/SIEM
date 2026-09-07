import express from 'express';
import cors from 'cors';
import "reflect-metadata";
import dotenv from 'dotenv';
import { initialize_database } from './Database/InitializeConnection';
import { Repository } from 'typeorm';
import { Db } from './Database/DbConnectionPool';
import { FirewallLog } from './Domain/models/FirewallLog';
import { FirewallMode } from './Domain/models/FirewallMode';
import { FirewallRule } from './Domain/models/FirewallRule';
import { ILogerService } from './Domain/services/ILogerService';
import { LogerService } from './Services/LogerService';
import { IFirewallLogRepository } from './Domain/services/IFirewallLogRepository';
import { IFirewallModeRepository } from './Domain/services/IFirewallModeRepository';
import { IFirewallRuleRepository } from './Domain/services/IFirewallRuleRepository';
import { IFirewallService } from './Domain/services/IFirewallService';
import { FirewallLogRepositoryService } from './Services/FirewallLogRepositoryService';
import { FirewallModeRepositoryService } from './Services/FirewallModeRepositoryService';
import { FirewallRuleRepositoryService } from './Services/FirewallRuleRepositoryService';
import { FirewallService } from './Services/FirewallService';
import { FirewallController } from './WebAPI/controllers/FirewallController';
import { FirewallProxyController } from './WebAPI/controllers/FirewallProxyController';

dotenv.config({ quiet: true });

const app = express();

const corsOrigin = process.env.CORS_ORIGIN?.split(",").map(m => m.trim()) ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map(m => m.trim()) ?? ["GET", "POST", "PUT", "DELETE"];

app.use(cors({
    origin: corsOrigin,
    methods: corsMethods,
}));

app.use(express.json());

initialize_database();

app.get("/health", async (req, res) => {
  try {
    // Provera baze:
    await Db.query("SELECT 1");

    res.status(200).json({
      status: "OK",
      service: "FirewallService", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (err) {
    // Ako baza padne, ceo status je DOWN sa kodom 503
    res.status(503).json({
      status: "DOWN",
      service: "FirewallService", 
      timestamp: new Date().toISOString()
    });
  }
});

// ORM Repositories
const firewallLogRepository: Repository<FirewallLog> = Db.getRepository(FirewallLog);
const firewallModeRepository: Repository<FirewallMode> = Db.getRepository(FirewallMode);
const firewallRuleRepository: Repository<FirewallRule> = Db.getRepository(FirewallRule);

// Services
const logger: ILogerService = new LogerService();

const firewallLogRepoService: IFirewallLogRepository = new FirewallLogRepositoryService(firewallLogRepository, logger);
const firewallModeRepoService: IFirewallModeRepository = new FirewallModeRepositoryService(firewallModeRepository, logger);
const firewallRuleRepoService: IFirewallRuleRepository = new FirewallRuleRepositoryService(firewallRuleRepository, logger);

const firewallService: IFirewallService = new FirewallService(firewallRuleRepoService, firewallModeRepoService, firewallLogRepoService);

// Controllers
const firewallController = new FirewallController(firewallService, firewallRuleRepoService, firewallModeRepoService, firewallLogRepoService, logger);
const firewallProxyController = new FirewallProxyController(firewallService, logger);

// Register routes
app.use('/api/v1', firewallController.getRouter());
app.use('/api/v1', firewallProxyController.getRouter());

export default app;