import { Request, Response, Router } from "express";
import { SimulationRequestDTO } from "../../Domain/DTOs/SimulationRequestDTO";
import { SimulationError } from "../../Domain/errors/SimulationError";
import { ISimulationService } from "../../Domain/services/ISimulationService";
import { SimulationType } from "../../Domain/types/SimulationType";

export class SimulationController {
  private readonly router: Router;
  private readonly maxIntensity: number;
  private readonly maxDurationSeconds: number;

  constructor(private readonly simulationService: ISimulationService) {
    this.router = Router();
    this.maxIntensity = this.readPositiveIntEnv("SIMULATOR_MAX_INTENSITY", 100);
    this.maxDurationSeconds = this.readPositiveIntEnv("SIMULATOR_MAX_DURATION_SECONDS", 900);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/health", this.healthCheck.bind(this));
    this.router.get("/simulator", this.listSimulations.bind(this));
    this.router.get("/simulator/:id", this.getSimulation.bind(this));
    this.router.post("/simulator/start", this.startSimulation.bind(this));
    this.router.post("/simulator/:id/stop", this.stopSimulation.bind(this));
  }

  private healthCheck(req: Request, res: Response): void {
    res.status(200).json({ status: "OK" });
  }

  private async listSimulations(req: Request, res: Response): Promise<void> {
    if (!this.isAllowed(req, res)) {
      return;
    }

    res.status(200).json(this.simulationService.listSimulations());
  }

  private async getSimulation(req: Request, res: Response): Promise<void> {
    if (!this.isAllowed(req, res)) {
      return;
    }

    const simulationId = String(req.params.id);
    const simulation = this.simulationService.getSimulation(simulationId);
    if (!simulation) {
      res.status(404).json({ message: "Simulation not found" });
      return;
    }
    res.status(200).json(simulation);
  }

  private async startSimulation(req: Request, res: Response): Promise<void> {
    if (!this.isAllowed(req, res)) {
      return;
    }

    const body = req.body as SimulationRequestDTO;

    if (!body.type || !Object.values(SimulationType).includes(body.type)) {
      res.status(400).json({ message: "Invalid simulation type" });
      return;
    }

    if (!Number.isFinite(body.intensity) || body.intensity <= 0 || body.intensity > this.maxIntensity) {
      res.status(400).json({
        message: `Intensity must be between 1 and ${this.maxIntensity}`,
      });
      return;
    }

    if (
      !Number.isFinite(body.durationSeconds) ||
      body.durationSeconds <= 0 ||
      body.durationSeconds > this.maxDurationSeconds
    ) {
      res.status(400).json({
        message: `Duration must be between 1 and ${this.maxDurationSeconds} seconds`,
      });
      return;
    }

    if (body.target !== undefined && (typeof body.target !== "string" || body.target.trim().length === 0)) {
      res.status(400).json({ message: "Target must be a non-empty string when provided" });
      return;
    }

    try {
      const result = await this.simulationService.startSimulation(body);
      res.status(201).json(result);
    } catch (err) {
      this.handleError(res, err);
    }
  }

  private async stopSimulation(req: Request, res: Response): Promise<void> {
    if (!this.isAllowed(req, res)) {
      return;
    }

    const simulationId = String(req.params.id);
    const result = await this.simulationService.stopSimulation(simulationId);
    if (!result) {
      res.status(404).json({ message: "Simulation not found" });
      return;
    }
    res.status(200).json(result);
  }

  private isSimulatorEnabled(): boolean {
    const enabled = process.env.SIMULATOR_ENABLED === "true";
    const env = process.env.NODE_ENV ?? "development";
    return enabled && env !== "production";
  }

  private isAllowed(req: Request, res: Response): boolean {
    if (!this.isSimulatorEnabled()) {
      res.status(403).json({ message: "Simulator disabled in this environment." });
      return false;
    }

    const adminKey = process.env.SIMULATOR_ADMIN_KEY;
    if (!adminKey) {
      return true;
    }

    const incoming = req.header("x-simulator-admin-key") ?? "";
    if (incoming !== adminKey) {
      res.status(403).json({ message: "Forbidden - invalid simulator admin key." });
      return false;
    }

    return true;
  }

  private handleError(res: Response, err: unknown): void {
    if (err instanceof SimulationError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    const message = err instanceof Error ? err.message : "Unexpected simulator error";
    res.status(500).json({ message });
  }

  private readPositiveIntEnv(name: string, fallback: number): number {
    const raw = process.env[name];
    if (!raw) {
      return fallback;
    }

    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return fallback;
    }

    return parsed;
  }

  public getRouter(): Router {
    return this.router;
  }
}
