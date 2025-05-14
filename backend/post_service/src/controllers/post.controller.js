import pool from "../services/db.js";
import dotenv from "dotenv";
dotenv.config();

export class PostController {
  static async createPost(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();

      const {
        content = req.body.content,
        type,
        status,
        media_url, // dari frontend (Vercel Blob)
        polling_options,
        postingan_comments,
        user_id,
      } = req.body;

      if (!user_id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const statusValue = status || "active";
      const allowedTypes = ["text", "image", "video", "polling"];
      const cleanType = allowedTypes.includes(type) ? type : "text";

      // Start transaction
      await connection.beginTransaction();

      const [result] = await connection.query(
        "INSERT INTO postingan (user_id, type, content, status) VALUES (?, ?, ?, ?)",
        [user_id, cleanType, content, statusValue]
      );

      const postId = result.insertId;

      if (cleanType === "image") {
        if (!media_url) {
          await connection.rollback();
          return res
            .status(400)
            .json({ message: "URL gambar harus disertakan." });
        }

        await connection.query(
          "INSERT INTO postingan_image (post_id, image) VALUES (?, ?)",
          [postId, media_url]
        );
        await connection.commit();
        return res.status(201).json({
          message: "Postingan berhasil dibuat dengan gambar",
          postId,
        });
      }

      if (cleanType === "video") {
        if (!media_url) {
          await connection.rollback();
          return res
            .status(400)
            .json({ message: "URL video harus disertakan." });
        }

        await connection.query(
          "INSERT INTO postingan_video (post_id, url_video) VALUES (?, ?)",
          [postId, media_url]
        );
        await connection.commit();
        return res.status(201).json({
          message: "Postingan berhasil dibuat dengan video",
          postId,
        });
      }

      if (cleanType === "polling") {
        if (
          !polling_options ||
          !Array.isArray(polling_options) ||
          polling_options.length < 2
        ) {
          await connection.rollback();
          return res.status(400).json({
            message: "Polling harus memiliki minimal dua pilihan.",
          });
        }

        for (const optionContent of polling_options) {
          await connection.query(
            "INSERT INTO postingan_polling_options (post_id, content) VALUES (?, ?)",
            [postId, optionContent]
          );
        }

        await connection.commit();
        return res.status(201).json({
          message: "Postingan polling berhasil dibuat",
          postId,
        });
      }

      if (postingan_comments?.length > 0) {
        for (const comment of postingan_comments) {
          await connection.query(
            "INSERT INTO postingan_comments (post_id, user_id, content) VALUES (?, ?, ?)",
            [postId, user_id, comment]
          );
        }
      }

      await connection.commit();
      return res.status(201).json({
        message: "Postingan berhasil dibuat",
        postId,
        type: cleanType,
      });
    } catch (error) {
      if (connection) await connection.rollback();
      return res.status(500).json({ message: error.message });
    } finally {
      if (connection) connection.release();
    }
  }

  static async getAllPosts(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();

      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      if (isNaN(pageNumber) || pageNumber < 1 || isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
        return res.status(400).json({ message: "Parameter page dan limit tidak valid." });
      }

      const offset = (pageNumber - 1) * limitNumber;

      // Query untuk mendapatkan total jumlah postingan
      const [totalPostsResult] = await connection.query("SELECT COUNT(*) AS total FROM postingan");
      const totalPosts = totalPostsResult[0].total;
      const totalPages = Math.ceil(totalPosts / limitNumber);

      // Base query untuk mendapatkan postingan dengan limit dan offset
      const query = `
        SELECT
          p.*,
          pi.image,
          pv.url_video,
          (SELECT COUNT(*) FROM postingan_likes WHERE post_id = p.id) AS like_count,
          (SELECT COUNT(*) FROM postingan_comments WHERE post_id = p.id) AS comment_count
        FROM postingan p
        LEFT JOIN postingan_image pi ON p.id = pi.post_id
        LEFT JOIN postingan_video pv ON p.id = pv.url_video
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?;
      `;

      const [posts] = await connection.query(query, [limitNumber, offset]);

      // Fungsi untuk mendapatkan user data
      const fetchUser = async (userId) => {
        try {
          const res = await fetch(`${process.env.USER_SERVICE}/api/users/${userId}`);
          const data = await res.json();
          return data.data?.[0] || null;
        } catch (e) {
          console.error("Error fetching user:", e);
          return null;
        }
      };

      // Proses setiap postingan
      const processedPosts = await Promise.all(posts.map(async (post) => {
        // Dapatkan data user untuk postingan
        const postUser = await fetchUser(post.user_id);

        // Dapatkan komentar untuk postingan ini
        const [comments] = await connection.query(
          "SELECT * FROM postingan_comments WHERE post_id = ?",
          [post.id]
        );

        // Proses setiap komentar
        const processedComments = await Promise.all(comments.map(async (comment) => {
          const commentUser = await fetchUser(comment.user_id);

          // Dapatkan replies untuk komentar ini
          const [replies] = await connection.query(
            "SELECT * FROM postingan_comment_replies WHERE comment_id = ?",
            [comment.id]
          );

          // Proses setiap reply
          const processedReplies = await Promise.all(replies.map(async (reply) => {
            const replyUser = await fetchUser(reply.user_id);
            return {
              id: reply.id,
              user_id: reply.user_id,
              content: reply.content,
              created_at: reply.created_at,
              username: replyUser?.username || null,
              avatar: replyUser?.avatar || null
            };
          }));

          return {
            id: comment.id,
            user_id: comment.user_id,
            content: comment.content,
            created_at: comment.created_at,
            username: commentUser?.username || null,
            avatar: commentUser?.avatar || null,
            replies: processedReplies
          };
        }));

        return {
          ...post,
          user: {
            username: postUser?.username || null,
            avatar: postUser?.avatar || null
          },
          comments: processedComments
        };
      }));

      return res.status(200).json({
        data: processedPosts,
        pagination: {
          currentPage: pageNumber,
          totalPages: totalPages,
          totalItems: totalPosts,
          itemsPerPage: limitNumber
        }
      });
    } catch (error) {
      console.error("Error in getAllPosts with pagination:", error);
      return res.status(500).json({ message: error.message });
    } finally {
      if (connection) connection.release();
    }
  }

  static async getPostById(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
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

      const fetchUser = async (userId) => {
        try {
          const response = await fetch(
            `${process.env.USER_SERVICE}/api/users/${userId}`
          );

          if (!response.ok) {
            throw new Error(`User service returned ${response.status}`);
          }

          const data = await response.json();
          console.log("User service response:", data);

          if (data.data) {
            if (Array.isArray(data.data)) {
              return {
                username: data.data[0]?.username || "Unknown",
                avatar: data.data[0]?.avatar || null,
              };
            } else {
              return {
                username: data.data.username || "Unknown",
                avatar: data.data.avatar || null,
              };
            }
          } else if (data.username) {
            return {
              username: data.username,
              avatar: data.avatar || null,
            };
          } else {
            throw new Error("Invalid user data structure");
          }
        } catch (e) {
          console.error("Error fetching user:", e);
          return { error: e.message };
        }
      };

      const [postRows] = await connection.query(query, [id]);

      if (postRows.length === 0) {
        return res.status(404).json({ message: "Postingan tidak ditemukan" });
      }

      let post = postRows[0];

      const userData = await fetchUser(post.user_id);
      if (userData.error) {
        post.user_error = userData.error;
        post.users = {
          username: userData.username,
          avatar: userData.avatar,
        };
      } else {
        post.users = {
          username: userData.username,
          avatar: userData.avatar,
        };
      }

      const [commentRows] = await connection.query(
        "SELECT * FROM postingan_comments WHERE post_id = ? ORDER BY created_at ASC",
        [id]
      );

      const formatReplies = async (commentId) => {
        const [replies] = await connection.query(
          `SELECT * FROM postingan_comment_replies 
           WHERE comment_id = ? 
           ORDER BY created_at ASC`,
          [commentId]
        );

        return Promise.all(
          replies.map(async (reply) => {
            const replyUserData = await fetchUser(reply.user_id);
            return {
              ...reply,
              username: replyUserData.error
                ? "Unknown"
                : replyUserData.username,
              avatar: replyUserData.error ? null : replyUserData.avatar,
              error: replyUserData.error || null,
            };
          })
        );
      };

      const formattedComments = await Promise.all(
        commentRows.map(async (comment) => {
          const userData = await fetchUser(comment.user_id);
          return {
            id: comment.id,
            user_id: comment.user_id,
            content: comment.content,
            created_at: comment.created_at,
            username: userData.error ? "Unknown" : userData.username,
            avatar: userData.error ? null : userData.avatar,
            error: userData.error || null,
            replies: await formatReplies(comment.id),
          };
        })
      );

      post.comments = formattedComments;

      return res.status(200).json({
        message: "Success get post by id",
        data: post,
      });
    } catch (error) {
      console.error("Error in getPostById:", error);
      return res.status(500).json({ message: error.message });
    } finally {
      if (connection) connection.release();
    }
  }

  static async updatePost(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const { id } = req.params;
      const { content, status, postingan_comments } = req.body;
      const statusValue = status ? "active" : "draft";

      await connection.beginTransaction();

      const query = `
        UPDATE postingan SET content = ?, status = ?, updated_at = NOW()
        WHERE id = ?`;
      const [result] = await connection.query(query, [
        content,
        statusValue,
        id,
      ]);

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ message: "Postingan tidak ditemukan" });
      }

      if (postingan_comments && postingan_comments.length > 0) {
        for (let comment of postingan_comments) {
          await connection.query(
            "INSERT INTO postingan_comments (post_id, user_id, content) VALUES (?, ?, ?)",
            [id, req.user.id, comment]
          );
        }
      }

      await connection.commit();
      return res.status(200).json({ message: "Postingan berhasil diupdate" });
    } catch (error) {
      if (connection) await connection.rollback();
      return res.status(500).json({ message: error.message });
    } finally {
      if (connection) connection.release();
    }
  }

  static async deletePost(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const { id } = req.params;
      const user_id = req.user?.id;
      const user_role = req.user?.role;

      await connection.beginTransaction();

      const [rows] = await connection.query(
        "SELECT user_id FROM postingan WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: "Postingan tidak ditemukan" });
      }

      const postOwnerId = rows[0].user_id;
      if (user_role !== "admin" && postOwnerId !== user_id) {
        await connection.rollback();
        return res.status(403).json({
          message: "Forbidden: Kamu tidak boleh menghapus postingan ini",
        });
      }

      await connection.query("DELETE FROM postingan WHERE id = ?", [id]);
      await connection.commit();
      return res.status(200).json({ message: "Postingan berhasil dihapus" });
    } catch (error) {
      if (connection) await connection.rollback();
      return res.status(500).json({ message: error.message });
    } finally {
      if (connection) connection.release();
    }
  }

  static async checkPostinganExists(postingan_id) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.query(
        "SELECT * FROM postingan WHERE id = ?",
        [postingan_id]
      );
      if (rows.length === 0) throw new Error("Postingan tidak ditemukan");
    } finally {
      if (connection) connection.release();
    }
  }

  static async votePoll(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const user_id = req.user?.id;
      const { post_id, option_id } = req.params;

      await connection.beginTransaction();

      const [option] = await connection.query(
        "SELECT post_id FROM postingan_polling_options WHERE id = ?",
        [option_id]
      );

      if (option.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: "Opsi tidak valid" });
      }

      if (option[0].post_id !== parseInt(post_id)) {
        await connection.rollback();
        return res
          .status(400)
          .json({ message: "Post ID tidak sesuai dengan opsi" });
      }

      const [existingVote] = await connection.query(
        `SELECT * FROM postingan_polling_votes 
         WHERE user_id = ? 
         AND option_id IN (
           SELECT id FROM postingan_polling_options WHERE post_id = ?
         )`,
        [user_id, post_id]
      );

      if (existingVote.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          message: "Anda sudah melakukan vote pada post ini",
        });
      }

      await connection.query(
        "INSERT INTO postingan_polling_votes (option_id, user_id) VALUES (?, ?)",
        [option_id, user_id]
      );

      await connection.commit();
      return res.status(201).json({ message: "Vote berhasil dicatat" });
    } catch (error) {
      if (connection) await connection.rollback();
      return res.status(500).json({ message: error.message });
    } finally {
      if (connection) connection.release();
    }
  }
}
