import connection from "../services/db.js";
import { promisify } from "util";

const query = promisify(connection.query).bind(connection);

export class NotifController {
  async getNotifs(req, res) {
    try {
      const sql = `SELECT * FROM notifikasi`;
      const results = await query(sql);
      res.json({ status: 200, message: 'Success get data', data: results });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async createNotifs(req, res) {
    try {
      const {
        user_id,
        laporan_id,
        title,
        message
      } = req.body;

      const sql = `
        INSERT INTO notifikasi (user_id, laporan_id, title, message)
        VALUES (?, ?, ?, ?)
      `;

      const values = [user_id, laporan_id, title, message];
      const result = await query(sql, values);

      res.json({
        status: 200,
        message: 'Success create data',
        data: { id: result.insertId, ...req.body }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async updateNotif(req, res) {
    try {
      const {
        user_id,
        laporan_id,
        title,
        message,
        is_read
      } = req.body;

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
        parseInt(req.params.id)
      ];

      const result = await query(sql, values);

      res.json({ status: 200, message: 'Success update data', data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async deleteNotif(req, res) {
    try {
      const id = parseInt(req.params.id);
      const sql = `DELETE FROM notifikasi WHERE id = ?`;

      const result = await query(sql, [id]);

      res.json({ status: 200, message: 'Success remove data', data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }
}
