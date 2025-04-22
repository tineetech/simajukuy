import connection from "../services/db.js";

export class PostController {

  // Create post
  static async createPost(req, res) {
    try {
      const { caption, type, status } = req.body;
      const user_id = req.user?.id;
      if (!user_id) return res.status(401).json({ message: "Unauthorized: User tidak ditemukan." });

      const statusValue = status ? "active" : "draft"; // status active/draft
      const allowedTypes = ['text', 'image', 'video', 'polling', 'map']; // allowed post types

      // Insert ke tabel utama postingan
      const cleanType = allowedTypes.includes(type) ? type : 'text'; // Default ke text jika type tidak valid
      const query = 'INSERT INTO postingan (user_id, type, content, status) VALUES (?, ?, ?, ?)';
      const [result] = await connection.promise().query(query, [user_id, cleanType, caption, statusValue]);
      const postId = result.insertId;

      // Handle image type
      if (cleanType === 'image') {
        const { image } = req.body; // Perubahan nama kolom menjadi image sesuai schema
        if (!image) return res.status(400).json({ message: "URL gambar harus diisi." });

        const imageQuery = 'INSERT INTO postingan_image (post_id, image) VALUES (?, ?)'; // Disesuaikan dengan schema
        await connection.promise().query(imageQuery, [postId, image]);
        return res.status(201).json({ message: "Postingan berhasil dibuat dengan gambar", postId });

      // Handle video type
      } else if (cleanType === 'video') {
        const { url_video, size, duration } = req.body;
        if (!url_video || !size || !duration) return res.status(400).json({ message: "URL, ukuran, dan durasi video harus diisi." });

        const videoQuery = 'INSERT INTO postingan_video (post_id, url_video, size, duration) VALUES (?, ?, ?, ?)'; // Disesuaikan dengan schema
        await connection.promise().query(videoQuery, [postId, url_video, size, duration]);
        return res.status(201).json({ message: "Postingan berhasil dibuat dengan video", postId });

      // Handle polling type
      } else if (cleanType === 'polling') {
        const { content, select_percentage, select_user_id } = req.body; // Polling menggunakan content, select_percentage, select_user_id
        if (!content || select_percentage === undefined || select_user_id === undefined) return res.status(400).json({ message: "Konten polling, persentase, dan user ID harus diisi." });

        const pollingQuery = 'INSERT INTO postingan_polling (post_id, content, select_percentage, select_user_id) VALUES (?, ?, ?, ?)'; // Disesuaikan dengan schema
        await connection.promise().query(pollingQuery, [postId, content, select_percentage, select_user_id]);
        return res.status(201).json({ message: "Postingan berhasil dibuat dengan polling", postId });

      } else {
        return res.status(201).json({ message: "Postingan teks biasa berhasil dibuat", postId });
      }

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get all posts
  static async getAllPosts(req, res) {
    try {
      const query = 'SELECT * FROM postingan';
      const [rows] = await connection.promise().query(query);
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get detail post by ID
  static async getPostById(req, res) {
    try {
      const { id } = req.params;
      const query = 'SELECT * FROM postingan WHERE id = ?';
      const [rows] = await connection.promise().query(query, [id]);
      if (rows.length === 0) return res.status(404).json({ message: "Postingan tidak ditemukan" });
      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Update post
  static async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { caption, status } = req.body;

      const statusValue = status ? "active" : "draft"; // Update status ke active/draft
      const query = 'UPDATE postingan SET caption = ?, status = ?, updated_at = NOW() WHERE id = ?';

      const [result] = await connection.promise().query(query, [caption, statusValue, id]);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Postingan tidak ditemukan" });
      return res.status(200).json({ message: "Postingan berhasil diupdate" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Delete post
  static async deletePost(req, res) {
    try {
      const { id } = req.params;
      const query = 'DELETE FROM postingan WHERE id = ?';
      const [result] = await connection.promise().query(query, [id]);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Postingan tidak ditemukan" });
      return res.status(200).json({ message: "Postingan berhasil dihapus" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Validasi Posting Sebelum Insert Data Tambahan
  static async checkPostinganExists(postingan_id) {
    const checkQuery = 'SELECT * FROM postingan WHERE id = ?';
    const [rows] = await connection.promise().query(checkQuery, [postingan_id]);
    if (rows.length === 0) throw new Error("Postingan tidak ditemukan");
  }

  // Tambah Image ke Postingan
  static async addImageToPost(req, res) {
    try {
      const { postingan_id, image } = req.body;
      if (!postingan_id || !image) return res.status(400).json({ message: "Data tidak lengkap" });

      await this.checkPostinganExists(postingan_id);

      const query = 'INSERT INTO postingan_image (post_id, image) VALUES (?, ?)'; // Disesuaikan dengan schema
      const [result] = await connection.promise().query(query, [postingan_id, image]);
      return res.status(201).json({ message: "Image berhasil ditambahkan", id: result.insertId });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Tambah Video ke Postingan
  static async addVideoToPost(req, res) {
    try {
      const { postingan_id, url_video, size, duration } = req.body;
      if (!postingan_id || !url_video || !size || !duration) return res.status(400).json({ message: "Data tidak lengkap" });

      await this.checkPostinganExists(postingan_id);

      const query = 'INSERT INTO postingan_video (post_id, url_video, size, duration) VALUES (?, ?, ?, ?)'; // Disesuaikan dengan schema
      const [result] = await connection.promise().query(query, [postingan_id, url_video, size, duration]);
      return res.status(201).json({ message: "Video berhasil ditambahkan", id: result.insertId });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Tambah Polling ke Postingan
  static async addPollingToPost(req, res) {
    try {
      const { postingan_id, content, select_percentage, select_user_id } = req.body;
      if (!postingan_id || !content || select_percentage === undefined || select_user_id === undefined) return res.status(400).json({ message: "Data tidak lengkap" });

      await this.checkPostinganExists(postingan_id);

      const query = 'INSERT INTO postingan_polling (post_id, content, select_percentage, select_user_id) VALUES (?, ?, ?, ?)'; // Disesuaikan dengan schema
      const [result] = await connection.promise().query(query, [postingan_id, content, select_percentage, select_user_id]);
      return res.status(201).json({ message: "Polling berhasil ditambahkan", id: result.insertId });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
