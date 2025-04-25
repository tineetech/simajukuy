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
    // Get all posts
    this.router.get(
      "/",
      this.authMiddleware.verifyToken,
      PostController.getAllPosts
    );

    // Get single post by ID
    this.router.get(
      "/:id",
      this.authMiddleware.verifyToken,
      PostController.getPostById
    );

    // Create a post (text, image, video, polling)
    this.router.post(
      "/",
      this.authMiddleware.verifyToken,
      upload.any(),
      (req, res, next) => {
        if (req.files?.length > 0) {
          const { type } = req.body;
          const fileType = req.files[0]?.mimetype;

          if (type === "image") {
            const allowed = [
              "image/jpeg",
              "image/png",
              "image/gif",
              "image/jpg",
            ];
            if (!allowed.includes(fileType)) {
              return res.status(400).json({
                message:
                  "Hanya file gambar (JPEG, PNG, JPG, GIF) yang diperbolehkan",
              });
            }
          } else if (type === "video") {
            const allowed = ["video/mp4", "video/webm", "video/ogg"];
            if (!allowed.includes(fileType)) {
              return res.status(400).json({
                message: "Hanya file video (MP4, WEBM, OGG) yang diperbolehkan",
              });
            }
          }
        }
        next();
      },
      PostController.createPost
    );

    // Tambahkan route untuk vote polling
    this.router.post(
      "/:post_id/vote/:option_id",
      this.authMiddleware.verifyToken,
      PostController.votePoll
    );

    // Add comment to a post
    this.router.post(
      "/:post_id/comments",
      this.authMiddleware.verifyToken,
      PostController.addComment
    );

    // Get comments from a post
    this.router.get(
      "/:post_id/comments",
      this.authMiddleware.verifyToken,
      PostController.getPostById
    );

    // Delete comment by ID
    this.router.delete(
      "/comments/:id",
      this.authMiddleware.verifyToken,
      PostController.deleteComment
    );

    // Like/Unlike a post
    this.router.post(
      "/:post_id/like",
      this.authMiddleware.verifyToken,
      PostController.toggleLikePost
    );

    // Update a post
    this.router.put(
      "/:id",
      this.authMiddleware.verifyToken,
      PostController.updatePost
    );

    // Delete a post
    this.router.delete(
      "/:id",
      this.authMiddleware.verifyToken,
      PostController.deletePost
    );
  }

  getRouter() {
    return this.router;
  }
}
