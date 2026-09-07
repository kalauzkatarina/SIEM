import { Router, Request, Response } from "express";
import { IIntegrityService } from "../../Domain/services/IIntegrityService";

export class IntegrityController {
    private readonly router: Router;

    constructor(
        private readonly integrityService: IIntegrityService
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/health", this.healthCheck.bind(this));
        this.router.post("/initialize", this.initializeHashChain.bind(this));
        this.router.get("/verify", this.verifyLogs.bind(this));
        this.router.get("/compromised", this.getCompromisedLogs.bind(this));
        this.router.get("/hashes", this.getAllHashes.bind(this));
    }

    private async healthCheck(req: Request, res: Response): Promise<void> {
        res.status(200).json({ status: "OK", service: "IntegrityService" });
    }

    private async initializeHashChain(req: Request, res: Response): Promise<void> {
        try {
            await this.integrityService.initializeHashChain();
            res.status(200).json({ message: "Hash chain updated successfully" });
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async verifyLogs(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.integrityService.verifyAllLogs();
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getCompromisedLogs(req: Request, res: Response): Promise<void> {
        try {
            const logs = await this.integrityService.getCompromisedLogs();
            res.status(200).json(logs);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getAllHashes(req: Request, res: Response): Promise<void> {
        try {
            const hashes = await this.integrityService.getAllHashes();
            res.status(200).json(hashes);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}