import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.verify.js";
import { PostController } from "../controllers/post.controller.js";

export class PostRouter {
  router;
  postController;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.postController = new PostController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      this.postController.getPosts,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/create",
      this.postController.createPost,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/image-create",
      this.postController.createImagePost,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/update/:id",
      this.postController.updatePost,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/delete/:id",
      this.postController.deletePost,
      this.authMiddleware.checkRole('admin')
    );
  }

  getRouter() {
    return this.router;
  }
}

