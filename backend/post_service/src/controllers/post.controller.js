import connection from "../services/db.js";

export class PostController {
  // Create post with image, video, or polling
  static async createPost(req, res) {
    try {
      const {
        content,
        type,
        status,
        url_video,
        select_percentage,
        select_user_id,
      } = req.body;
      const user_id = req.user?.id;
      if (!user_id)
        return res
          .status(401)
          .json({ message: "Unauthorized: User tidak ditemukan." });

      const statusValue = status ? "active" : "draft";
      const allowedTypes = ["text", "image", "video", "polling", "map"];
      const cleanType = allowedTypes.includes(type) ? type : "text";

      const query =
        "INSERT INTO postingan (user_id, type, content, status) VALUES (?, ?, ?, ?)";
      const [result] = await connection
        .promise()
        .query(query, [user_id, cleanType, content, statusValue]);
      const postId = result.insertId;

      if (cleanType === "image") {
        const file = req.files?.[0];
        if (!file)
          return res
            .status(400)
            .json({ message: "File gambar harus diupload." });

        const allowedImageTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/gif",
        ];
        if (!allowedImageTypes.includes(file.mimetype)) {
          return res.status(400).json({
            message: "File harus berupa gambar (JPEG, PNG, JPG, GIF).",
          });
        }

        const imageUrl = "/storage/images/" + file.filename;
        const imageQuery =
          "INSERT INTO postingan_image (post_id, image) VALUES (?, ?)";
        await connection.promise().query(imageQuery, [postId, imageUrl]);

        return res
          .status(201)
          .json({ message: "Postingan berhasil dibuat dengan gambar", postId });
      } else if (cleanType === "video") {
        const file = req.files?.[0];
        if (!file)
          return res
            .status(400)
            .json({ message: "File video harus diupload." });

        const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
        if (!allowedVideoTypes.includes(file.mimetype)) {
          return res
            .status(400)
            .json({ message: "File harus berupa video (MP4, WEBM, OGG)." });
        }

        const videoUrl = "/storage/videos/" + file.filename;
        const videoQuery =
          "INSERT INTO postingan_video (post_id, url_video) VALUES (?, ?)";
        await connection.promise().query(videoQuery, [postId, videoUrl]);

        return res
          .status(201)
          .json({ message: "Postingan berhasil dibuat dengan video", postId });
      } else if (cleanType === "polling") {
        if (
          !content ||
          select_percentage === undefined ||
          select_user_id === undefined
        ) {
          return res.status(400).json({
            message: "Konten polling, persentase, dan user ID harus diisi.",
          });
        }
        const pollingQuery =
          "INSERT INTO postingan_polling (post_id, content, select_percentage, select_user_id) VALUES (?, ?, ?, ?)";
        await connection
          .promise()
          .query(pollingQuery, [
            postId,
            content,
            select_percentage,
            select_user_id,
          ]);
        return res.status(201).json({
          message: "Postingan berhasil dibuat dengan polling",
          postId,
        });
      } else {
        return res
          .status(201)
          .json({ message: "Postingan teks biasa berhasil dibuat", postId });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // Like post
  // Toggle Like / Unlike Post (kayak TikTok)
  static async toggleLikePost(req, res) {
    try {
      const user_id = req.user?.id;
      const { post_id } = req.params;

      if (!user_id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Cek apakah user udah nge-like
      const [check] = await connection.promise().query(
        "SELECT * FROM postingan_likes WHERE post_id = ? AND user_id = ?",
        [post_id, user_id]
      );

      if (check.length > 0) {
        // Kalau udah like, maka unlike
        await connection.promise().query(
          "DELETE FROM postingan_likes WHERE post_id = ? AND user_id = ?",
          [post_id, user_id]
        );
        return res.status(200).json({ message: "Unliked" });
      } else {
        // Kalau belum like, maka like
        await connection.promise().query(
          "INSERT INTO postingan_likes (post_id, user_id) VALUES (?, ?)",
          [post_id, user_id]
        );
        return res.status(200).json({ message: "Liked" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  static async createPost(req, res) {
    try {
      const { caption, type, status } = req.body;

      const user_id = req.user?.id;
      if (!user_id) return res.status(401).json({ message: "Unauthorized: User tidak ditemukan." });

      const statusValue = status ? 1 : 0;
      const allowedTypes = ['image', 'video', 'polling'];
      
      // Insert ke tabel utama postingan
      const query = 'INSERT INTO postingan (user_id, caption, type, status) VALUES (?, ?, ?, ?)';
      const cleanType = allowedTypes.includes(type) ? type : 'text';
      const [result] = await connection.promise().query(query, [user_id, caption, cleanType, statusValue]);
      const postId = result.insertId;

      if (cleanType === 'image') {
        const { url, size } = req.body;
        if (!url || !size) return res.status(400).json({ message: "URL dan ukuran gambar harus diisi." });

        const imageQuery = 'INSERT INTO postingan_image (postingan_id, url, size) VALUES (?, ?, ?)';
        await connection.promise().query(imageQuery,  [postId, url, size]);
        return res.status(201).json({ message: "Postingan berhasil dibuat dengan gambar", postId });

      } else if (cleanType === 'video') {
        const { url, size, duration } = req.body;
        if (!url || !size || !duration) return res.status(400).json({ message: "URL, ukuran, dan durasi video harus diisi." });

        const videoQuery = 'INSERT INTO postingan_video (postingan_id, url, size, duration) VALUES (?, ?, ?, ?)';
        await connection.promise().query(videoQuery, [postId, url, size, duration]);
        return res.status(201).json({ message: "Postingan berhasil dibuat dengan video", postId });

      } else if (cleanType === 'polling') {
        const { question, options } = req.body;
        if (!question || !options) return res.status(400).json({ message: "Pertanyaan dan opsi polling harus diisi." });

        const pollingQuery = 'INSERT INTO postingan_polling (postingan_id, question, options) VALUES (?, ?, ?)';
        await connection.promise().query(pollingQuery, [postId, question, JSON.stringify(options)]);
        return res.status(201).json({ message: "Postingan berhasil dibuat dengan polling", postId });

      } else {
        // Kalau bukan type khusus, anggap sebagai postingan caption biasa.
        return res.status(201).json({ message: "Postingan teks biasa berhasil dibuat", postId });
      }

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }


  // Get all posts (with like count)
  static async getAllPosts(req, res) {
    try {
      const query = `
        SELECT p.*, 
               pi.image, 
               pv.url_video,
               pp.content AS polling_content, pp.select_percentage, pp.select_user_id,
               (SELECT COUNT(*) FROM postingan_likes pl WHERE pl.post_id = p.id) AS like_count
        FROM postingan p
        LEFT JOIN postingan_image pi ON p.id = pi.post_id
        LEFT JOIN postingan_video pv ON p.id = pv.post_id
        LEFT JOIN postingan_polling pp ON p.id = pp.post_id
      `;
      const [rows] = await connection.promise().query(query);
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getPostById(req, res) {
    try {
      const { id } = req.params;
      const query = "SELECT * FROM postingan WHERE id = ?";
      const [rows] = await connection.promise().query(query, [id]);
      if (rows.length === 0)
        return res.status(404).json({ message: "Postingan tidak ditemukan" });
      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { content, status } = req.body;
      const statusValue = status ? "active" : "draft";
      const query =
        "UPDATE postingan SET content = ?, status = ?, updated_at = NOW() WHERE id = ?";
      const [result] = await connection
        .promise()
        .query(query, [content, statusValue, id]);
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Postingan tidak ditemukan" });
      return res.status(200).json({ message: "Postingan berhasil diupdate" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async deletePost(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user?.id;
      const user_role = req.user?.role;
  
      // Ambil postingan berdasarkan ID
      const [rows] = await connection.promise().query(
        "SELECT user_id FROM postingan WHERE id = ?",
        [id]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "Postingan tidak ditemukan" });
      }
  
      const postOwnerId = rows[0].user_id;
  
      // Kalau bukan admin dan bukan pemilik postingan, tolak akses
      if (user_role !== "admin" && postOwnerId !== user_id) {
        return res
          .status(403)
          .json({ message: "Forbidden: Kamu tidak boleh menghapus postingan ini" });
      }
  
      // Lanjut hapus postingan
      const [result] = await connection.promise().query(
        "DELETE FROM postingan WHERE id = ?",
        [id]
      );
  
      return res.status(200).json({ message: "Postingan berhasil dihapus" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  

  static async checkPostinganExists(postingan_id) {
    const checkQuery = "SELECT * FROM postingan WHERE id = ?";
    const [rows] = await connection.promise().query(checkQuery, [postingan_id]);
    if (rows.length === 0) throw new Error("Postingan tidak ditemukan");
  }

  static async addImageToPost(req, res) {
    try {
      const { postingan_id, image } = req.body;
      if (!postingan_id || !image)
        return res.status(400).json({ message: "Data tidak lengkap" });
      await this.checkPostinganExists(postingan_id);
      const query =
        "INSERT INTO postingan_image (post_id, image) VALUES (?, ?)";
      const [result] = await connection
        .promise()
        .query(query, [postingan_id, image]);
      return res
        .status(201)
        .json({ message: "Image berhasil ditambahkan", id: result.insertId });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async addVideoToPost(req, res) {
    try {
      const { postingan_id, url_video } = req.body;
      if (!postingan_id || !url_video)
        return res.status(400).json({ message: "Data tidak lengkap" });
      await this.checkPostinganExists(postingan_id);
      const query =
        "INSERT INTO postingan_video (post_id, url_video) VALUES (?, ?)";
      const [result] = await connection
        .promise()
        .query(query, [postingan_id, url_video]);
      return res
        .status(201)
        .json({ message: "Video berhasil ditambahkan", id: result.insertId });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async addPollingToPost(req, res) {
    try {
      const { postingan_id, content, select_percentage, select_user_id } =
        req.body;
      if (
        !postingan_id ||
        !content ||
        select_percentage === undefined ||
        select_user_id === undefined
      )
        return res.status(400).json({ message: "Data tidak lengkap" });
      await this.checkPostinganExists(postingan_id);
      const query =
        "INSERT INTO postingan_polling (post_id, content, select_percentage, select_user_id) VALUES (?, ?, ?, ?)";
      const [result] = await connection
        .promise()
        .query(query, [
          postingan_id,
          content,
          select_percentage,
          select_user_id,
        ]);
      return res
        .status(201)
        .json({ message: "Polling berhasil ditambahkan", id: result.insertId });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
