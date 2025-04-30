import connection from "../services/db.js";

export class PostController {
  static async createPost(req, res) {
    try {
      const { content, type, status, polling_options, postingan_comments } =
        req.body;

      const user_id = req.user?.id;
      if (!user_id) return res.status(401).json({ message: "Unauthorized" });

      const statusValue = status || "active";

      const allowedTypes = ["text", "image", "video", "polling"];

      const cleanType = allowedTypes.includes(type) ? type : "text";

      const [result] = await connection
        .promise()
        .query(
          "INSERT INTO postingan (user_id, type, content, status) VALUES (?, ?, ?, ?)",
          [user_id, cleanType, content, statusValue]
        );

      const postId = result.insertId;
      const file = req.files?.[0];

      if (cleanType === "image") {
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
        await connection
          .promise()
          .query("INSERT INTO postingan_image (post_id, image) VALUES (?, ?)", [
            postId,
            imageUrl,
          ]);
        return res
          .status(201)
          .json({ message: "Postingan berhasil dibuat dengan gambar", postId });
      }

      if (cleanType === "video") {
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
        await connection
          .promise()
          .query(
            "INSERT INTO postingan_video (post_id, url_video) VALUES (?, ?)",
            [postId, videoUrl]
          );
        return res
          .status(201)
          .json({ message: "Postingan berhasil dibuat dengan video", postId });
      }

      if (cleanType === "polling") {
        if (
          !polling_options ||
          !Array.isArray(polling_options) ||
          polling_options.length < 2
        ) {
          return res
            .status(400)
            .json({ message: "Polling harus memiliki minimal dua pilihan." });
        }

        for (const optionContent of polling_options) {
          await connection
            .promise()
            .query(
              "INSERT INTO postingan_polling_options (post_id, content) VALUES (?, ?)",
              [postId, optionContent]
            );
        }

        return res
          .status(201)
          .json({ message: "Postingan polling berhasil dibuat", postId });
      }

      if (postingan_comments?.length > 0) {
        for (const comment of postingan_comments) {
          await connection
            .promise()
            .query(
              "INSERT INTO postingan_comments (post_id, user_id, content) VALUES (?, ?, ?)",
              [postId, user_id, comment]
            );
        }
      }

      return res.status(201).json({
        message: "Postingan berhasil dibuat",
        postId,
        type: cleanType,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAllPosts(req, res) {
    try {
      const query = `
        SELECT 
          p.*,
          pi.image,
          pv.url_video,
          (SELECT COUNT(*) FROM postingan_likes WHERE post_id = p.id) AS like_count,
          (SELECT COUNT(*) FROM postingan_comments WHERE post_id = p.id) AS comment_count,
          COALESCE(
            (SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', po.id,
                'content', po.content,
                'votes', (SELECT COUNT(*) FROM postingan_polling_votes WHERE option_id = po.id),
                'percentage', ROUND(
                  (SELECT COUNT(*) FROM postingan_polling_votes WHERE option_id = po.id) / 
                  GREATEST(
                    (SELECT COUNT(DISTINCT user_id) 
                     FROM postingan_polling_votes 
                     WHERE option_id IN (
                       SELECT id FROM postingan_polling_options 
                       WHERE post_id = p.id
                     )),
                    1
                  ) * 100,
                  1
                )
              )
            )
            FROM postingan_polling_options po 
            WHERE po.post_id = p.id),
            JSON_ARRAY()
          ) AS polling_options
        FROM postingan p
        LEFT JOIN postingan_image pi ON p.id = pi.post_id
        LEFT JOIN postingan_video pv ON p.id = pv.post_id
        ORDER BY p.created_at DESC`;

      const [rows] = await connection.promise().query(query);

      // Format polling options

      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getPostById(req, res) {
    try {
      const { id } = req.params;

      const query = `
        SELECT 
          p.*,
          pi.image,
          pv.url_video,
          (SELECT COUNT(*) FROM postingan_likes WHERE post_id = p.id) AS like_count,
          (SELECT COUNT(*) FROM postingan_comments WHERE post_id = p.id) AS comment_count,
          COALESCE(
            (SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', po.id,
                'content', po.content,
                'votes', (SELECT COUNT(*) FROM postingan_polling_votes WHERE option_id = po.id),
                'percentage', ROUND(
                  (SELECT COUNT(*) FROM postingan_polling_votes WHERE option_id = po.id) / 
                  GREATEST(
                    (SELECT COUNT(DISTINCT user_id) 
                     FROM postingan_polling_votes 
                     WHERE option_id IN (
                       SELECT id FROM postingan_polling_options 
                       WHERE post_id = p.id
                     )),
                    1
                  ) * 100,
                  1
                )
              )
            )
            FROM postingan_polling_options po 
            WHERE po.post_id = p.id),
            JSON_ARRAY()
          ) AS polling_options
        FROM postingan p
        LEFT JOIN postingan_image pi ON p.id = pi.post_id
        LEFT JOIN postingan_video pv ON p.id = pv.post_id
        WHERE p.id = ?
        LIMIT 1;
      `;

      const [postRows] = await connection.promise().query(query, [id]);

      if (postRows.length === 0) {
        return res.status(404).json({ message: "Postingan tidak ditemukan" });
      }

      const post = postRows[0];

      // Get comments
      const [commentRows] = await connection
        .promise()
        .query(
          "SELECT * FROM postingan_comments WHERE post_id = ? ORDER BY created_at ASC",
          [id]
        );

      return res.status(200).json({
        post,
        comments: commentRows,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // ... (method lainnya tetap sama)

  static async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { content, status, postingan_comments } = req.body;
      const statusValue = status ? "active" : "draft";

      const query = `
        UPDATE postingan SET content = ?, status = ?, updated_at = NOW()
        WHERE id = ?`;
      const [result] = await connection
        .promise()
        .query(query, [content, statusValue, id]);

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Postingan tidak ditemukan" });

      // Update komentar jika ada
      if (postingan_comments && postingan_comments.length > 0) {
        for (let comment of postingan_comments) {
          await connection
            .promise()
            .query(
              "INSERT INTO postingan_comments (post_id, user_id, content) VALUES (?, ?, ?)",
              [id, req.user.id, comment]
            );
        }
      }

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

      const [rows] = await connection
        .promise()
        .query("SELECT user_id FROM postingan WHERE id = ?", [id]);

      if (rows.length === 0)
        return res.status(404).json({ message: "Postingan tidak ditemukan" });

      const postOwnerId = rows[0].user_id;
      if (user_role !== "admin" && postOwnerId !== user_id)
        return res.status(403).json({
          message: "Forbidden: Kamu tidak boleh menghapus postingan ini",
        });

      await connection
        .promise()
        .query("DELETE FROM postingan WHERE id = ?", [id]);
      return res.status(200).json({ message: "Postingan berhasil dihapus" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async checkPostinganExists(postingan_id) {
    const [rows] = await connection
      .promise()
      .query("SELECT * FROM postingan WHERE id = ?", [postingan_id]);
    if (rows.length === 0) throw new Error("Postingan tidak ditemukan");
  }

  static async votePoll(req, res) {
    try {
      const user_id = req.user?.id;
      const { post_id, option_id } = req.params;

      // Validasi opsi polling berdasarkan option_id
      const [option] = await connection
        .promise()
        .query("SELECT post_id FROM postingan_polling_options WHERE id = ?", [
          option_id,
        ]);

      if (option.length === 0) {
        return res.status(404).json({ message: "Opsi tidak valid" });
      }

      // Pastikan post_id yang diberikan sesuai dengan post_id opsi yang dipilih
      if (option[0].post_id !== parseInt(post_id)) {
        return res
          .status(400)
          .json({ message: "Post ID tidak sesuai dengan opsi" });
      }

      // Cek apakah user sudah memberikan vote pada post_id tersebut

      console.log(req.message);

      const [existingVote] = await connection.promise().query(
        `SELECT * FROM postingan_polling_votes 
         WHERE user_id = ? 
         AND option_id IN (
           SELECT id FROM postingan_polling_options WHERE post_id = ?
         )`,
        [user_id, post_id]
      );

      if (existingVote.length > 0) {
        return res
          .status(400)
          .json({ message: "Anda sudah melakukan vote pada post ini" });
      }

      // Insert vote
      await connection
        .promise()
        .query(
          "INSERT INTO postingan_polling_votes (option_id, user_id) VALUES (?, ?)",
          [option_id, user_id]
        );

      return res.status(201).json({ message: "Vote berhasil dicatat" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
