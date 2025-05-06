import connection from "../services/db.js";
import { hashPass } from "../helpers/hashpassword.js";
import axios from "axios"
import fs from 'fs';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HF_ACCESS_TOKEN = process.env.HF_API_KEY;

export class LaporController {
  // async analisisWithAi(req, res) {
  //   if (!req.file) {
  //     return res.status(400).json({ error: "No file uploaded" });
  //   }

  //   const imagePath = req.file.path;
  //   try {
  //     const imageData = fs.readFileSync(imagePath);

  //     async function query(data) {
  //       const response = await fetch(
  //         "https://router.huggingface.co/hf-inference/models/microsoft/resnet-50",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
  //             "Content-Type": "image/jpeg",
  //           },
  //           method: "POST",
  //           body: data,
  //         }
  //       );
  //       const result = await response.json();
  //       return result;
  //     }

  //     const respon = await query(imageData);
  //     console.log(respon)
  //     const categories = ["cliff", "drop", "valley", "foreland"];
  //     if (respon.find((item) => item.label.includes(categories))) {
  //       res.status(200).json({ data: respon });
  //     } else {
  //       return res.status(200).json({data: respon});
  //       res.status(400).json({ message: "Gambar itu bukan bencana alam !"});
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  async analisisWithAi(req, res) {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ message: "File gambar harus diupload." });
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
        // Tambahkan API key lainnya sesuai kebutuhan
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
            break; // Jika berhasil, keluar dari loop
          } catch (error) {
            if (error.status === 429 || error.status >= 500) {
              console.log(`API Key ${attempts + 1} (ending in ${apiKeys[attempts].slice(-5)}) gagal, mencoba API Key ${attempts + 2}...`);
              attempts++; // Mencoba API key berikutnya
            } else {
              // Jika error bukan karena rate limit atau server error, langsung kirim error
              return res.status(error.status).json({ message: "Gagal menghubungi Gemini API.", error: error.error });
            }
          }
        }
  
        if (attempts === apiKeys.length) {
          // Jika semua API key gagal
          const errorMessage = "Semua API Key gagal menghubungi Gemini API.";
          console.error(errorMessage);
          return res.status(500).json({
            message: errorMessage,
            error: { message: "Semua API Key tidak dapat digunakan." } // Provide a more specific error
          });
        }
        console.log("Respon dari Gemini API:", responseData);
        return res.status(200).json({ data: responseData });
      } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Terjadi kesalahan internal.", error: error.message });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan internal.", error: error.message });
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
      return res.status(500).json({ error: error.message });
    }
  }

  async createLapor (req, res) {
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
      } = req.body

       // Validasi user_id sebelum mencoba mengambil data user
      if (isNaN(parseInt(user_id))) {
        console.log(user_id)
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const file = req.file;
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

      const findUser = await axios.get(`${process.env.USER_SERVICE}/api/users/${user_id}`);
      if (!findUser) {
        return res.status(400).json({ message: "User not found" });
      }

      const sqlCreateData = 'INSERT INTO laporan (user_id, image, description, type_verification, status, notes, location_latitude, location_longitude, event_date, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      connection.query(sqlCreateData, [parseInt(user_id), imageUrl, description, type_verification, status ?? "pending", notes, location_lat, location_long, event_date, category], (err, result) => {
        if (err) {
          console.error(err)
          return res.status(400).json({"error": err})
        } 

        res.status(200).json({
          status: 200,
          data: result,
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
        description,
        type_verification,
        status,
        notes
      } = req.body

      const image = req.file ? req.file.path : null;

      const findUser = await axios.get(`${process.env.USER_SERVICE}/api/users/${user_id}`);
      if (!findUser) {
          return res.status(400).json({ message: "User not found" });
      }

      const sqlUpdateData = 'UPDATE laporan set user_id = ?, image = ?, description = ?, type_verification = ?, status = ?, notes = ? WHERE id = ?';
      connection.query(sqlUpdateData, [user_id, image, description, type_verification, status, notes, req.params.id], (err, result) => {
        if (err) return res.status(500).json({"error": err})
          
        return res.status(200).json({ status: 200, message: 'success update data', data: result })
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }
  
  async updateStatus (req, res) {
    try {
      const {
        status,
      } = req.body

      const sqlGetData = 'SELECT * FROM laporan WHERE id = ?';
      const sqlUpdateData = 'UPDATE laporan set status = ? WHERE id = ?';
      connection.query(sqlGetData, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({"error": err})
        if (result[0].status === 'success') return res.status(400).json({"error": 'Gagal update status, status laporan sudah success diverifikasi.'})
        
        connection.query(sqlUpdateData, [status, req.params.id], (err, result) => {
          if (err) return res.status(500).json({"error": err})
  
          return res.status(200).json({ message: 'success update data', data: result })
        })
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
