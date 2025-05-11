import pool from "../services/db.js";
import { hashPass } from "../helpers/hashpassword.js";
import axios from "axios";
import fs from 'fs';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HF_ACCESS_TOKEN = process.env.HF_API_KEY;

export class LaporController {
  async analisisWithAi(req, res) {
    // Fungsi ini tidak membutuhkan database connection
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "File gambar harus diupload." });
    }

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

    const imagePath = path.join(__dirname, '../../storage/images/', file.filename);
    try {
      const imageData = fs.readFileSync(imagePath);
      const base64Image = Buffer.from(imageData).toString('base64');

      // Daftar API Keys
      const apiKeys = [
        'AIzaSyBct01Zunl6XInJJBK-xCLGgfw-Xt2_1Nw',
        'AIzaSyAhWg020Pz3Qs5k01kJicBZZd7RQ-E3P8M',
        'AIzaSyBXfLrI8nbCKH_mkC2rD9vL2atwo751nPM',
      ];

      const requestBody = {
        "contents": [
          {
            "parts": [
              {
                "inline_data": {
                  "mime_type": file.mimetype,
                  "data": base64Image
                }
              },
              {
                "text": "Apakah gambar tersebut merupakan bencana alam atau kerusakan jalan, sampah menumpuk? Jelaskan temuanmu secara ringkas dan berikan kata awalan YA jika terindikasi dan TIDAK jika tidak terindikasi setelah itu penjelasannya."
              }
            ]
          }
        ]
      };

      const fetchData = async (apiKey) => {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Error from Gemini API with key ending in ${apiKey.slice(-5)}:`, errorData);
          throw {
            status: response.status,
            message: `Gagal menghubungi Gemini API dengan key ending in ${apiKey.slice(-5)}`,
            error: errorData
          };
        }
        const result = await response.json();
        return result;
      }

      let responseData;
      let attempts = 0;
      
      try {
        while (attempts < apiKeys.length) {
          try {
            responseData = await fetchData(apiKeys[attempts]);
            break;
          } catch (error) {
            if (error.status === 429 || error.status >= 500) {
              console.log(`API Key ${attempts + 1} (ending in ${apiKeys[attempts].slice(-5)}) gagal, mencoba API Key ${attempts + 2}...`);
              attempts++;
            } else {
              return res.status(error.status).json({ message: "Gagal menghubungi Gemini API.", error: error.error });
            }
          }
        }
  
        if (attempts === apiKeys.length) {
          const errorMessage = "Semua API Key gagal menghubungi Gemini API.";
          console.error(errorMessage);
          return res.status(500).json({
            message: errorMessage,
            error: { message: "Semua API Key tidak dapat digunakan." }
          });
        }
        console.log("Respon dari Gemini API:", responseData);
        return res.status(200).json({ data: responseData });
      } catch (error) {
        console.error("Error :", error);
        return res.status(500).json({ message: "Terjadi kesalahan internal.", error: error.message });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan internal.", error: error.message });
    }
  }

  async getLapor(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query('SELECT * FROM laporan');
      
      res.status(200).json({ 
        status: 200, 
        message: 'success get data', 
        data: result 
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    } finally {
      if (connection) connection.release();
    }
  }

  async createLapor(req, res) {
    let connection;
    try {
      const {
        user_id,
        location_lat,
        location_long,
        event_date,
        category,
        description,
        type_verification,
        status,
        notes
      } = req.body;

      // Validasi file
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "File gambar harus diupload." });
      }

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

      // Validasi user_id
      if (isNaN(parseInt(user_id))) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Verifikasi user
      const findUser = await axios.get(`${process.env.USER_SERVICE}/api/users/${user_id}`);
      if (!findUser) {
        return res.status(400).json({ message: "User not found" });
      }

      const imageUrl = "/storage/images/" + file.filename;
      connection = await pool.getConnection();

      const [result] = await connection.query(
        `INSERT INTO laporan 
        (user_id, image, description, type_verification, status, notes, location_latitude, location_longitude, event_date, category) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          parseInt(user_id), 
          imageUrl, 
          description, 
          type_verification, 
          status ?? "pending", 
          notes, 
          location_lat, 
          location_long, 
          event_date, 
          category
        ]
      );

      res.status(200).json({
        status: 200,
        data: result,
        message: 'Berhasil membuat laporan!',
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    } finally {
      if (connection) connection.release();
    }
  }

  async updateLapor(req, res) {
    let connection;
    try {
      const {
        user_id,
        description,
        type_verification,
        status,
        notes
      } = req.body;

      const image = req.file ? req.file.path : null;

      // Verifikasi user
      const findUser = await axios.get(`${process.env.USER_SERVICE}/api/users/${user_id}`);
      if (!findUser) {
        return res.status(400).json({ message: "User not found" });
      }

      connection = await pool.getConnection();
      const [result] = await connection.query(
        `UPDATE laporan 
        SET user_id = ?, image = ?, description = ?, type_verification = ?, status = ?, notes = ? 
        WHERE id = ?`,
        [user_id, image, description, type_verification, status, notes, req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Laporan tidak ditemukan" });
      }

      res.status(200).json({ 
        status: 200, 
        message: 'success update data', 
        data: result 
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    } finally {
      if (connection) connection.release();
    }
  }
  
  async updateStatus(req, res) {
    let connection;
    try {
      const { status } = req.body;

      connection = await pool.getConnection();
      
      // Mulai transaction
      await connection.beginTransaction();

      try {
        // Cek status saat ini
        const [current] = await connection.query(
          'SELECT * FROM laporan WHERE id = ? FOR UPDATE',
          [req.params.id]
        );

        if (current.length === 0) {
          return res.status(404).json({ message: "Laporan tidak ditemukan" });
        }

        if (current[0].status === 'success') {
          return res.status(400).json({
            message: 'Gagal update status, status laporan sudah success diverifikasi.'
          });
        }

        // Update status
        const [result] = await connection.query(
          'UPDATE laporan SET status = ? WHERE id = ?',
          [status, req.params.id]
        );

        await connection.commit();

        res.status(200).json({ 
          message: 'success update data', 
          data: result 
        });
      } catch (err) {
        await connection.rollback();
        throw err;
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    } finally {
      if (connection) connection.release();
    }
  }

  async deleteLapor(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query(
        'DELETE FROM laporan WHERE id = ?',
        [req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Laporan tidak ditemukan" });
      }

      res.status(200).json({ 
        status: 200, 
        message: 'success remove laporan', 
        data: result 
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    } finally {
      if (connection) connection.release();
    }
  }
}
