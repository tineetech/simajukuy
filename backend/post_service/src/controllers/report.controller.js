import pool from "../services/db.js";

export class ReportController {
  /**
   * Report a post
   */
  static async reportPost(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const { post_id } = req.params;
      const { reason } = req.body;
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await connection.beginTransaction();

      // Check if the post exists in the reporting table
      const [existingReport] = await connection.query(
        "SELECT id FROM postingan_reports WHERE post_id = ? AND user_id = ?",
        [post_id, user_id]
      );

      if (existingReport.length > 0) {
        await connection.rollback();
        return res.status(400).json({ message: "You already reported this post" });
      }

      // Create report
      await connection.query(
        "INSERT INTO postingan_reports (post_id, user_id, reason) VALUES (?, ?, ?)",
        [post_id, user_id, reason]
      );

      await connection.commit();
      return res.status(201).json({ message: "Post reported successfully" });
    } catch (error) {
      if (connection) await connection.rollback();
      return res.status(500).json({ message: error.message });
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Get all reports (Admin only)
   */
  static async getAllReports(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const user_role = req.user?.role;

      if (user_role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }

      const query = `
        SELECT r.*
        FROM postingan_reports r
        ORDER BY r.created_at DESC
      `;

      const [reports] = await connection.query(query);

      return res.status(200).json(reports);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Update report status (Admin only)
   */
  static async updateReportStatus(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const { report_id } = req.params;
      const { status } = req.body;
      const user_role = req.user?.role;

      if (user_role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }

      const allowedStatuses = ["pending", "resolved", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      await connection.beginTransaction();

      const [result] = await connection.query(
        "UPDATE postingan_reports SET status = ? WHERE id = ?", 
        [status, report_id]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ message: "Report not found" });
      }

      await connection.commit();
      return res.status(200).json({ message: "Report status updated" });
    } catch (error) {
      if (connection) await connection.rollback();
      return res.status(500).json({ message: error.message });
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Get reports for a specific post (Admin/Moderator)
   */
  static async getPostReports(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const { post_id } = req.params;
      const user_role = req.user?.role;

      if (!["admin", "moderator"].includes(user_role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient privileges" });
      }

      const query = `
        SELECT r.*
        FROM postingan_reports r
        WHERE r.post_id = ?
        ORDER BY r.created_at DESC
      `;

      const [reports] = await connection.query(query, [post_id]);

      return res.status(200).json(reports);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    } finally {
      if (connection) connection.release();
    }
  }
}