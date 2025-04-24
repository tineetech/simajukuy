import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.verify.js";
import { NotifController } from "../controllers/notif.controller.js";

export class NotifRouter {
  router;
  notifController;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.notifController = new NotifController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      this.notifController.getNotifs,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/create",
      this.notifController.createNotifs,
      this.authMiddleware.checkRole('admin')
    );

    this.router.post(
      "/update/:id",
      this.notifController.updateNotif,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/delete/:id",
      this.notifController.deleteNotif,
      this.authMiddleware.checkRole('admin')
    );
  }

  getRouter() {
    return this.router;
  }
}

