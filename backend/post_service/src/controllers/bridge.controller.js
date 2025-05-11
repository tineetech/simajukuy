import pool from "../services/db.js";

export class BridgeController {
  static async toggleLikePost(req, res) {
    const connection = await pool.getConnection();
    try {
      const user_id = req.user?.id;
      const { post_id } = req.params;
      if (!user_id) return res.status(401).json({ message: "Unauthorized" });

      const [check] = await connection.query(
        "SELECT * FROM postingan_likes WHERE post_id = ? AND user_id = ?",
        [post_id, user_id]
      );

      if (check.length > 0) {
        await connection.query(
          "DELETE FROM postingan_likes WHERE post_id = ? AND user_id = ?",
          [post_id, user_id]
        );
        return res.status(200).json({ message: "Unliked" });
      } else {
        await connection.query(
          "INSERT INTO postingan_likes (post_id, user_id) VALUES (?, ?)",
          [post_id, user_id]
        );
        return res.status(200).json({ message: "Liked" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    } finally {
      connection.release(); // Release connection back to the pool
    }
  }

  static async addComment(req, res) {
    const connection = await pool.getConnection();
    try {
      const { post_id } = req.params;
      const user_id = req.user?.id;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Komentar tidak boleh kosong." });
      }

      await connection.query(
        "INSERT INTO postingan_comments (post_id, user_id, content) VALUES (?, ?, ?)",
        [post_id, user_id, content]
      );

      return res.status(201).json({ message: "Komentar berhasil ditambahkan." });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    } finally {
      connection.release();
    }
  }

  static async deleteComment(req, res) {
    const connection = await pool.getConnection();
    try {
      const { id } = req.params; // ID dari komentar
      const { post_id } = req.body; // post_id dari frontend
      const user_id = req.user?.id;
      const user_role = req.user?.role;

      // Cek apakah komentar dengan ID itu ada dan milik post yang benar
      const [rows] = await connection.query(
        "SELECT user_id, post_id FROM postingan_comments WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Komentar tidak ditemukan" });
      }

      const comment = rows[0];

      if (comment.post_id !== parseInt(post_id)) {
        return res.status(400).json({ message: "Komentar tidak sesuai dengan post_id" });
      }

      // Validasi user
      if (user_id !== comment.user_id && user_role !== "admin") {
        return res.status(403).json({
          message: "Forbidden: Tidak bisa menghapus komentar orang lain",
        });
      }

      // Hapus komentar
      await connection.query("DELETE FROM postingan_comments WHERE id = ?", [id]);

      return res.status(200).json({ message: "Komentar berhasil dihapus" });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan saat menghapus komentar" });
    } finally {
      connection.release();
    }
  }

  static async addReply(req, res) {
    const connection = await pool.getConnection();
    try {
      const { comment_id } = req.params;
      const user_id = req.user?.id;
      const { content, parent_reply_id } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Balasan tidak boleh kosong." });
      }

      // Validasi apakah comment parent ada
      const [commentCheck] = await connection.query(
        "SELECT id FROM postingan_comments WHERE id = ?",
        [comment_id]
      );

      if (commentCheck.length === 0) {
        return res.status(404).json({ message: "Komentar tidak ditemukan." });
      }

      // Jika ini reply ke reply lain, validasi parent reply
      if (parent_reply_id) {
        const [replyCheck] = await connection.query(
          "SELECT id FROM postingan_comment_replies WHERE id = ?",
          [parent_reply_id]
        );

        if (replyCheck.length === 0) {
          return res.status(404).json({ message: "Balasan tidak ditemukan." });
        }
      }

      await connection.query(
        "INSERT INTO postingan_comment_replies (comment_id, user_id, content, parent_reply_id) VALUES (?, ?, ?, ?)",
        [comment_id, user_id, content, parent_reply_id || null]
      );

      return res.status(201).json({ message: "Balasan berhasil ditambahkan." });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    } finally {
      connection.release();
    }
  }

  static async deleteReply(req, res) {
    const connection = await pool.getConnection();
    try {
      const { id } = req.params;
      const user_id = req.user?.id;
      const user_role = req.user?.role;

      const [rows] = await connection.query(
        "SELECT user_id FROM postingan_comment_replies WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Balasan tidak ditemukan" });
      }

      const replyOwner = rows[0].user_id;

      if (user_id !== replyOwner && user_role !== "admin") {
        return res.status(403).json({
          message: "Forbidden: Tidak bisa menghapus balasan orang lain",
        });
      }

      await connection.query("DELETE FROM postingan_comment_replies WHERE id = ?", [id]);

      return res.status(200).json({ message: "Balasan berhasil dihapus" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    } finally {
      connection.release();
    }
  }

  static async getReplies(req, res) {
    const connection = await pool.getConnection();
    try {
      const { comment_id } = req.params;

      const fetchUser = async (id) => {
        try {
          const res = await fetch(`${process.env.USER_SERVICE}/api/users/`);
          const data = await res.json();
          return data;
        } catch (e) {
          console.error(e);
          throw e;
        }
      };

      // Hanya mengambil data reply dari database tanpa join ke tabel users
      const [replies] = await connection.query(
        `SELECT * FROM postingan_comment_replies 
         WHERE comment_id = ?
         ORDER BY created_at ASC`,
        [comment_id]
      );

      // Format replies dengan data user dari user service
      const formattedReplies = await Promise.all(
        replies.map(async (reply) => {
          try {
            const user = await fetchUser(reply.user_id);
            return {
              id: reply.id,
              comment_id: reply.comment_id,
              user_id: reply.user_id,
              content: reply.content,
              created_at: reply.created_at,
              username: user?.data[0].username || null,
              avatar: user?.data[0].avatar || null,
            };
          } catch (error) {
            console.error("Error fetching user for reply:", error);
            return {
              ...reply,
              username: null,
              avatar: null,
              error: error.message,
            };
          }
        })
      );

      return res.status(200).json(formattedReplies);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    } finally {
      connection.release();
    }
  }
}
