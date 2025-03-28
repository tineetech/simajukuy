import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthMiddleware } from "../middleware/auth.verify.js";

export class AuthRouter {
  router;
  authController;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/google",
      this.authController.googleRegister
    );

    this.router.post(
      "/register",
      this.authController.registerCustomer
    );

    this.router.post(
      "/register/store-admin",
      this.authController.registerStoreAdmin
    );

    this.router.post(
      "/verification",
      this.authMiddleware.verifyToken,
      this.authController.verifyAccount
    );

    this.router.post(
      "/reset-password",
      this.authController.resetPassword
    );

    this.router.post(
      "/verify/reset-password",
      this.authMiddleware.verifyToken,
      this.authController.verifyResetPassword
    );

    this.router.post(
      "/login",
      this.authController.loginAny
    );

    this.router.get(
      "/check-email-token/:token",
      this.authController.checkExpTokenEmailVerif
    );

    this.router.get(
      "/cek-token",
      this.authMiddleware.verifyExpiredToken
    );
  }

  getRouter() {
    return this.router;
  }
}

