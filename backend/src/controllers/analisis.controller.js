import { PrismaClient } from "@prisma/client";
import fs from 'fs';

const HF_ACCESS_TOKEN = process.env.HF_API_KEY;
const prisma = new PrismaClient();

export class AnalisisController {
  async analisisGas(req, res) {
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
}
