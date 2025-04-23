import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.verify.js";
import { PostController } from "../controllers/post.controller.js";
import { upload } from "../middleware/multer.js";

export class PostRouter {
  router;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", this.authMiddleware.verifyToken, PostController.getAllPosts);

    this.router.post("/create", this.authMiddleware.verifyToken, upload.any(), PostController.createPost);

    this.router.post(
      "/image-create",
      this.authMiddleware.verifyToken,
      upload.single("file"),
      (req, res, next) => {
        if (req.fileValidationError) {
          return res.status(400).send({ message: req.fileValidationError });
        }
        next();
      },
      PostController.addImageToPost
    );

    this.router.post("/video-create", this.authMiddleware.verifyToken, upload.single("file"), PostController.addVideoToPost);

    this.router.post("/polling-create", this.authMiddleware.verifyToken, PostController.addPollingToPost);

    this.router.put("/update/:id", this.authMiddleware.verifyToken, PostController.updatePost);

    this.router.delete("/delete/:id", this.authMiddleware.verifyToken, PostController.deletePost);

    this.router.post("/:post_id/like", this.authMiddleware.verifyToken, PostController.toggleLikePost);
  }

  getRouter() {
    return this.router;
  }
}