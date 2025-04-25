import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.verify.js";
import { LaporController } from "../controllers/lapor.controller.js";

export class LaporRouter {
  router;
  laporController;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.laporController = new LaporController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/analisis-ai",
      this.laporController.analisisWithAi,
      this.authMiddleware.verifyToken
    );

    this.router.get(
      "/",
      this.laporController.getLapor,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/create",
      this.laporController.createLapor,
      this.authMiddleware.checkRole('admin')
    );

    this.router.post(
      "/update/:id",
      this.laporController.updateLapor,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/delete/:id",
      this.laporController.deleteLapor,
      this.authMiddleware.checkRole('admin')
    );
  }

  getRouter() {
    return this.router;
  }
}

