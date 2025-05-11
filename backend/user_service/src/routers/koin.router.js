import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.verify.js";
import { KoinController } from "../controllers/koin.controller.js";

export class KoinRouter {
  router;
  koinController;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.koinController = new KoinController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/riwayat-penukaran",
      this.authMiddleware.verifyToken,
      this.koinController.getTrxKoin,
    );
  }

  getRouter() {
    return this.router;
  }
}

