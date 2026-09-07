import { Request, Response, Router } from "express";
import { requireSysAdmin } from "../../Middlewares/authorization/AuthorizeMiddleware";
import {
  SimulationRequestDTO,
  SimulatorGatewayService,
} from "../../Services/domains/SimulatorGatewayService";
import { ReqParams } from "../../Domain/types/ReqParams";

export class SimulatorGatewayController {
  private readonly router: Router;

  constructor(private readonly simulatorService: SimulatorGatewayService, private readonly authenticate: any) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/simulator",
      this.authenticate,
      requireSysAdmin,
      this.listSimulations.bind(this)
    );
    this.router.get(
      "/simulator/:id",
      this.authenticate,
      requireSysAdmin,
      this.getSimulation.bind(this)
    );
    this.router.post(
      "/simulator/start",
      this.authenticate,
      requireSysAdmin,
      this.startSimulation.bind(this)
    );
    this.router.post(
      "/simulator/:id/stop",
      this.authenticate,
      requireSysAdmin,
      this.stopSimulation.bind(this)
    );
  }

  private async listSimulations(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.simulatorService.listSimulations();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async getSimulation(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
    try {
      const result = await this.simulatorService.getSimulation(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async startSimulation(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body as SimulationRequestDTO;
      const result = await this.simulatorService.startSimulation(payload);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async stopSimulation(req: Request<ReqParams<'id'>>, res: Response): Promise<void> {
    try {
      const result = await this.simulatorService.stopSimulation(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
