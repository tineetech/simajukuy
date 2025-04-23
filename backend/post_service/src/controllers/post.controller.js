import connection from "../services/db.js";

export class PostController {

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

      const statusValue = status ? 1 : 0;
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
      const { postingan_id, url, size } = req.body;
      if (!postingan_id || !url || !size) return res.status(400).json({ message: "Data tidak lengkap" });

      await this.checkPostinganExists(postingan_id);

      const query = 'INSERT INTO postingan_image (postingan_id, url, size) VALUES (?, ?, ?)';
      const [result] = await connection.promise().query(query, [postingan_id, url, size]);
      return res.status(201).json({ message: "Image berhasil ditambahkan", id: result.insertId });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Tambah Video ke Postingan
  static async addVideoToPost(req, res) {
    try {
      const { postingan_id, url, size, duration } = req.body;
      if (!postingan_id || !url || !size || !duration) return res.status(400).json({ message: "Data tidak lengkap" });

      await this.checkPostinganExists(postingan_id);

      const query = 'INSERT INTO postingan_video (postingan_id, url, size, duration) VALUES (?, ?, ?, ?)';
      const [result] = await connection.promise().query(query, [postingan_id, url, size, duration]);
      return res.status(201).json({ message: "Video berhasil ditambahkan", id: result.insertId });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Tambah Polling ke Postingan
  static async addPollingToPost(req, res) {
    try {
      const { postingan_id, question, options } = req.body;
      if (!postingan_id || !question || !options) return res.status(400).json({ message: "Data tidak lengkap" });

      await this.checkPostinganExists(postingan_id);

      const query = 'INSERT INTO postingan_polling (postingan_id, question, options) VALUES (?, ?, ?)';
      const [result] = await connection.promise().query(query, [postingan_id, question, JSON.stringify(options)]);
      return res.status(201).json({ message: "Polling berhasil ditambahkan", id: result.insertId });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
