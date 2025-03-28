import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AuthRouter } from "./routers/auth.router.js";
import multer from 'multer';
import fs from 'fs';
import axios from 'axios';
import { pipeline } from "@xenova/transformers";
import path from 'path';
import { InferenceClient } from "@huggingface/inference";

dotenv.config();
// tes
// Inisialisasi express
const PORT = process.env.PORT || 5000;
const base_url_fe = process.env.FE_URL;
const uploadDir = path.join(process.cwd(), 'uploads');
const HF_ACCESS_TOKEN = process.env.HF_API_KEY;
const client = new InferenceClient(HF_ACCESS_TOKEN);

// Pastikan folder uploads ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });
const app = express();

app.use(cors({
  origin: base_url_fe,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

const authRouter = new AuthRouter().getRouter();
app.use("/auth", authRouter);

// Route test
app.get("/", (req, res) => {
  res.send("🚀 Backend Express is running!");
});

app.post('/analisis', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
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
            "Content-Type": "image/jpeg"
          },
          method: "POST",
          body: data,
        }
      );
      const result = await response.json();
      return result;
    }
    
    const respon = await query(imageData);
    res.send({ respon });
  } catch (e) {
    console.log(e)
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});