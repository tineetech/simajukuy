import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.verify.js";
import { ArtikelController } from "../controllers/artikel.controller.js";

export class ArtikelRouter {
  router;
  artikelController;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.artikelController = new ArtikelController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      this.artikelController.getBerita,
      this.authMiddleware.verifyToken
    );
    
    this.router.get(
      "/details",
      this.artikelController.getArtikelLengkap,
      this.authMiddleware.verifyToken
    );
    
  }

  getRouter() {
    return this.router;
  }
}

