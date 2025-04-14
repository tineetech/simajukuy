import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.verify.js";
import { AnalisisController } from "../controllers/analisis.controller.js";
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import os from "os";

const uploadDir = path.join(process.cwd(), 'uploads'); // dev
// const uploadDir = path.join(os.tmpdir(), "uploads"); // prod

// Pastikan folder uploads ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

export class AnalisisRouter {
  router;
  analisisController;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.analisisController = new AnalisisController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/",
      upload.single("image"),
      this.analisisController.analisisGas,
      this.authMiddleware.verifyToken
    );
  }

  getRouter() {
    return this.router;
  }
}

