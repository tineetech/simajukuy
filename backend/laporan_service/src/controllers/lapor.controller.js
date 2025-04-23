import connection from "../services/db.js";
import { hashPass } from "../helpers/hashpassword.js";
import axios from "axios"
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();

const HF_ACCESS_TOKEN = process.env.HF_API_KEY;

export class LaporController {
  async analisisWithAi(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imagePath = req.file.path;
    try {
      const imageData = fs.readFileSync(imagePath);

      async function query(data) {
        const response = await fetch(
          "https://router.huggingface.co/hf-inference/models/microsoft/resnet-50",
          {
            headers: {
              Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
              "Content-Type": "image/jpeg",
            },
            method: "POST",
            body: data,
          }
        );
        const result = await response.json();
        return result;
      }

      const respon = await query(imageData);
      res.send(respon);
      const categories = ["cliff", "drop", "valley", "foreland"];
      if (respon.find((item) => item.label.includes(categories))) {
        res.send({ respon });
      } else {
        res.send("Gambar itu bukan bencana alam !");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getLapor (req, res) {
    try {
      const sqlDataGet = 'SELECT * FROM laporan';
      connection.query(sqlDataGet, (err, result) => {
        if (err) res.json({"error": err})
        if (result) {
          res.json({ status: 200, message: 'success get data', data: result })
        }
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async createLapor (req, res) {
    try {
      const {
        user_id,
        image,
        description,
        type_verification,
        status,
        notes
      } = req.body

      const findUser = await axios.get(`${process.env.USER_SERVICE}/api/users/${user_id}`);
      if (!findUser) {
        return res.status(400).json({ message: "User not found" });
      }

      const sqlCreateData = 'INSERT INTO laporan (user_id, image, description, type_verification, status, notes) VALUES (?, ?, ?, ?, ?, ?)';
      connection.query(sqlCreateData, [user_id, image, description, type_verification, status ?? "pending", notes], (err, result) => {
        if (err) res.json({"error": err})
        if (!result) {
          return res.status(400).json({ message: "Gagal buat laporan" });
        }

        res.json({
          status: 200,
          message: 'Berhasil membuat laporan!',
        });
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async updateLapor (req, res) {
    try {
      const {
        user_id,
        image,
        description,
        type_verification,
        status,
        notes
      } = req.body

      const sqlUpdateData = 'UPDATE laporan set user_id = ?, image = ?, description = ?, type_verification = ?, status = ?, notes = ? WHERE id = ?';
      connection.query(sqlUpdateData, [user_id, image, description, type_verification, status, notes, req.params.id], (err, result) => {
        if (err) res.json({"error": err})
        if (!result) {
          return res.status(400).json({ message: "Cannot update laporan" });
        }
        res.json({ status: 200, message: 'success update data', data: result })
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async deleteLapor (req, res) {
    try {
      const sqlDeleteData = 'DELETE FROM laporan WHERE id = ?';
      connection.query(sqlDeleteData, [req.params.id], (err, result) => {
        res.json({ status: 200, message: 'success remove laporan', data: result })
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }
}
