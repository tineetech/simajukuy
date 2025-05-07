import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.verify.js";
import { PostController } from "../controllers/post.controller.js";
import { ReportController } from "../controllers/report.controller.js";
import { BridgeController } from "../controllers/bridge.controller.js";
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
    this.router.get(
      "/",
      // this.authMiddleware.verifyToken,
      PostController.getAllPosts
    );

    this.router.get(
      "/:id",
      // this.authMiddleware.verifyToken,
      PostController.getPostById
    );

    this.router.post(
      "/create",
      this.authMiddleware.verifyToken,
      upload.any(),
      this.validateFileUpload,
      PostController.createPost
    );

    this.router.put(
      "/:id",
      this.authMiddleware.verifyToken,
      PostController.updatePost
    );

    this.router.delete(
      "/:id",
      this.authMiddleware.verifyToken,
      PostController.deletePost
    );

    // ======================
    // INTERACTION ROUTES
    // ======================
    this.router.post(
      "/:post_id/like",
      this.authMiddleware.verifyToken,
      BridgeController.toggleLikePost
    );

    // ======================
    // POLLING ROUTES
    // ======================
    this.router.post(
      "/:post_id/vote/:option_id",
      this.authMiddleware.verifyToken,
      PostController.votePoll
    );
    
    // ======================
    // COMMENT ROUTES
    // ======================
    this.router.post(
      "/:post_id/comments",
      this.authMiddleware.verifyToken,
      BridgeController.addComment
    );


    this.router.delete(
      "/comments/:id",
      this.authMiddleware.verifyToken,
      BridgeController.deleteComment
    );

    // ======================
    // REPORT ROUTES
    // ======================
    this.router.post(
      "/:post_id/report",
      this.authMiddleware.verifyToken,
      ReportController.reportPost
    );

    this.router.get(
      "/:post_id/reports",
      this.authMiddleware.verifyToken,
      ReportController.getPostReports
    );

    // ======================
    // ADMIN-ONLY REPORT ROUTES
    // ======================
    this.router.get(
      "/reports/all",
      this.authMiddleware.verifyToken,
      ReportController.getAllReports
    );

    this.router.patch(
      "/reports/:report_id/status",
      this.authMiddleware.verifyToken,
      ReportController.updateReportStatus
    );
  }

  /**
   * Middleware to validate file uploads based on post type
   */
  validateFileUpload(req, res, next) {
    if (req.files?.length > 0) {
      const { type } = req.body;
      const fileType = req.files[0]?.mimetype;

      if (type === "image") {
        const allowed = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
        if (!allowed.includes(fileType)) {
          return res.status(400).json({
            message: "Hanya file gambar (JPEG, PNG, JPG, GIF) yang diperbolehkan",
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
  }

  getRouter() {
    return this.router;
  }
}