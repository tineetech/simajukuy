import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.verify.js";
import { LaporanController } from "../controllers/laporan.controller.js";

export class LaporanRouter {
  router;
  laporanController;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.laporanController = new LaporanController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      this.laporanController.getLaporans,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/create",
      this.laporanController.createLaporan,
      this.authMiddleware.checkRole('admin')
    );

    this.router.post(
      "/update/:id",
      this.laporanController.updateLaporan,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/delete/:id",
      this.laporanController.deleteLaporan,
      this.authMiddleware.checkRole('admin')
    );
  }

  getRouter() {
    return this.router;
  }
}

