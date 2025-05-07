import connection from "../services/db.js";
import { hashPass } from "../helpers/hashpassword.js";
import axios from "axios"
import fs from 'fs';
import dotenv from "dotenv";
import path from "path";
import { parse } from 'node-html-parser';
import { fileURLToPath } from "url";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HF_ACCESS_TOKEN = process.env.HF_API_KEY;

export class ArtikelController {
  async getBerita (req, res) {
    const kompasUrl = 'https://www.kompas.com/';
  
    try {
      const response = await fetch(kompasUrl);
      if (!response.ok) {
        return res.status(response.status).json({ error: `Gagal mengambil halaman: ${response.statusText}` });
      }
      const html = await response.text();
      const root = parse(html);
      const beritaBencana = [];
      const articleLinks = root.querySelectorAll('.latest--news li a');
  
      articleLinks.forEach(linkElement => {
        const titleElement = linkElement.querySelector('.article__link');
        const title = titleElement ? titleElement.textContent.trim() : '';
        const link = linkElement.getAttribute('href');
  
        if (title.toLowerCase().includes('bencana') || link.toLowerCase().includes('bencana')) {
          beritaBencana.push({ title, link });
        }
      });
  
      res.json(beritaBencana);
  
    } catch (error) {
      console.error("Terjadi kesalahan saat scraping atau parsing:", error);
      res.status(500).json({ error: `Gagal mengambil dan memproses berita: ${error.message}` });
    }
  }
}
