import pool from "../services/db.js";
import jwt from "jsonwebtoken";

export class NotifController {
  async getNotifs(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const sql = `SELECT * FROM notifikasi`;
      const results = await connection.query(sql);
      
      res.json({ 
        status: 200, 
        message: "Success get data", 
        data: results[0] 
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async createNotifs(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const { user_id, laporan_id, title, message } = req.body;

      await connection.beginTransaction();

      const sql = `
        INSERT INTO notifikasi (user_id, laporan_id, title, message)
        VALUES (?, ?, ?, ?)
      `;

      const values = [user_id, laporan_id, title, message];
      const result = await connection.query(sql, values);

      await connection.commit();

      res.json({
        status: 200,
        message: "Success create data",
        data: { id: result[0].insertId, ...req.body },
      });
    } catch (error) {
      if (connection) await connection.rollback();
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async updateNotif(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const { user_id, laporan_id, title, message, is_read } = req.body;

      await connection.beginTransaction();

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

      const result = await connection.query(sql, values);

      await connection.commit();

      res.json({ 
        status: 200, 
        message: "Success update data", 
        data: result[0] 
      });
    } catch (error) {
      if (connection) await connection.rollback();
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async deleteNotif(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const id = parseInt(req.params.id);

      await connection.beginTransaction();

      const sql = `DELETE FROM notifikasi WHERE id = ?`;
      const result = await connection.query(sql, [id]);

      await connection.commit();

      res.json({ 
        status: 200, 
        message: "Success remove data", 
        data: result[0] 
      });
    } catch (error) {
      if (connection) await connection.rollback();
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async getNotifsByUserId(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const user_id = req.user?.id;
      
      if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const sql = `SELECT * FROM notifikasi WHERE user_id = ?`;
      const [results] = await connection.query(sql, [user_id]);

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
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }
}