import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.verify.js";
import { UsersController } from "../controllers/users.controller.js";

export class UsersRouter {
  router;
  usersController;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.usersController = new UsersController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      this.usersController.getUsers,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/create",
      this.usersController.createUsers,
      this.authMiddleware.checkRole('admin')
    );

    this.router.post(
      "/update/:id",
      this.usersController.updateUsersPublic,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/delete/:id",
      this.usersController.deleteUsers,
      this.authMiddleware.checkRole('admin')
    );
  }

  getRouter() {
    return this.router;
  }
}

