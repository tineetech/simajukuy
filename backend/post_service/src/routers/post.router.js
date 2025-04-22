import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.verify.js"; // Import middleware autentikasi
import { PostController } from "../controllers/post.controller.js"; // Import controller yang sudah dibuat

export class PostRouter {
  router;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Mendapatkan semua postingan
    this.router.get(
      "/", 
      this.authMiddleware.verifyToken, 
      PostController.getAllPosts
    );

    // Membuat postingan baru
    this.router.post(
      "/create",
      this.authMiddleware.verifyToken, 
      PostController.createPost
    );

    // Menambahkan gambar ke postingan
    this.router.post(
      "/image-create",
      this.authMiddleware.verifyToken, 
      PostController.addImageToPost
    );

    // Menambahkan video ke postingan
    this.router.post(
      "/video-create",
      this.authMiddleware.verifyToken, 
      PostController.addVideoToPost
    );

    // Menambahkan polling ke postingan
    this.router.post(
      "/polling-create",
      this.authMiddleware.verifyToken, 
      PostController.addPollingToPost
    );

    // Mengupdate postingan berdasarkan ID
    this.router.put(
      "/update/:id",
      this.authMiddleware.verifyToken, 
      PostController.updatePost
    );

    // Menghapus postingan berdasarkan ID, hanya untuk admin
    this.router.delete(
      "/delete/:id",
      this.authMiddleware.checkRole('admin'), 
      PostController.deletePost
    );
  }

  // Mengembalikan router yang sudah di-setup
  getRouter() {
    return this.router;
  }
}
