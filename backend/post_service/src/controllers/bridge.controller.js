import connection from "../services/db.js";

export class BridgeController {
  static async toggleLikePost(req, res) {
    try {
      const user_id = req.user?.id;
      const { post_id } = req.params;
      if (!user_id) return res.status(401).json({ message: "Unauthorized" });

      const [check] = await connection
        .promise()
        .query(
          "SELECT * FROM postingan_likes WHERE post_id = ? AND user_id = ?",
          [post_id, user_id]
        );

      if (check.length > 0) {
        await connection
          .promise()
          .query(
            "DELETE FROM postingan_likes WHERE post_id = ? AND user_id = ?",
            [post_id, user_id]
          );
        return res.status(200).json({ message: "Unliked" });
      } else {
        await connection
          .promise()
          .query(
            "INSERT INTO postingan_likes (post_id, user_id) VALUES (?, ?)",
            [post_id, user_id]
          );
        return res.status(200).json({ message: "Liked" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async addComment(req, res) {
    try {
      const { post_id } = req.params;
      const user_id = req.user?.id;
      const { content } = req.body;

      // console.log(req);
      console.log("Body:", req.body);

      if (!content) {
        return res
          .status(400)
          .json({ message: "Komentar tidak boleh kosong." });
      }

      await connection
        .promise()
        .query(
          "INSERT INTO postingan_comments (post_id, user_id, content) VALUES (?, ?, ?)",
          [post_id, user_id, content]
        );

      return res
        .status(201)
        .json({ message: "Komentar berhasil ditambahkan." });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async deleteComment(req, res) {
    try {
      const { id } = req.params; // ID dari komentar
      const { post_id } = req.body; // post_id dari frontend
      const user_id = req.user?.id;
      const user_role = req.user?.role;

      // Cek apakah komentar dengan ID itu ada dan milik post yang benar
      const [rows] = await connection
        .promise()
        .query("SELECT user_id, post_id FROM postingan_comments WHERE id = ?", [
          id,
        ]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Komentar tidak ditemukan" });
      }

      const comment = rows[0];

      if (comment.post_id !== parseInt(post_id)) {
        return res
          .status(400)
          .json({ message: "Komentar tidak sesuai dengan post_id" });
      }

      // Validasi user
      if (user_id !== comment.user_id && user_role !== "admin") {
        return res.status(403).json({
          message: "Forbidden: Tidak bisa menghapus komentar orang lain",
        });
      }

      // Hapus komentar
      await connection
        .promise()
        .query("DELETE FROM postingan_comments WHERE id = ?", [id]);

      return res.status(200).json({ message: "Komentar berhasil dihapus" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan saat menghapus komentar" });
    }
  }
}
