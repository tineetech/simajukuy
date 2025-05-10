import connection from "../services/db.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";

const query = promisify(connection.query).bind(connection);



export class NotifController {
  async getNotifs(req, res) {
    try {
      const sql = `SELECT * FROM notifikasi`;
      const results = await query(sql);
      res.json({ status: 200, message: "Success get data", data: results });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async createNotifs(req, res) {
    try {
      const { user_id, laporan_id, title, message } = req.body;

      const sql = `
        INSERT INTO notifikasi (user_id, laporan_id, title, message)
        VALUES (?, ?, ?, ?)
      `;

      const values = [user_id, laporan_id, title, message];
      const result = await query(sql, values);

      res.json({
        status: 200,
        message: "Success create data",
        data: { id: result.insertId, ...req.body },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async updateNotif(req, res) {
    try {
      const { user_id, laporan_id, title, message, is_read } = req.body;

      const sql = `
        UPDATE notifikasi
        SET user_id = ?, laporan_id = ?, title = ?, message = ?, is_read = ?, updated_at = NOW()
        WHERE id = ?
      `;

      const values = [
        user_id,
        laporan_id,
        title,
        message,
        is_read ?? false,
        parseInt(req.params.id),
      ];

      const result = await query(sql, values);

      res.json({ status: 200, message: "Success update data", data: result });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async deleteNotif(req, res) {
    try {
      const id = parseInt(req.params.id);
      const sql = `DELETE FROM notifikasi WHERE id = ?`;

      const result = await query(sql, [id]);

      res.json({ status: 200, message: "Success remove data", data: result });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }
  async getNotifsByUserId(req, res) {
    try {
      const user_id = req.user?.id; // Akses userId dari req
      if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const sql = `SELECT * FROM notifikasi WHERE user_id = ?`;
      const results = await query(sql, [user_id]);

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No notifications found for this user" });
      }

      res.json({
        
        status: 200,
        message: "Success get notifications by user",
        data: results,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }
}
