import connection from "../services/db.js";
import { hashPass } from "../helpers/hashpassword.js";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { parse } from "node-html-parser";
import { fileURLToPath } from "url";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HF_ACCESS_TOKEN = process.env.HF_API_KEY;

export class ArtikelController {
  async getBerita(req, res) {
    const kompasUrl = "https://www.kompas.com/";

    try {
      const response = await fetch(kompasUrl);
      if (!response.ok) {
        return res
          .status(response.status)
          .json({ error: `Gagal mengambil halaman: ${response.statusText}` });
      }
      const html = await response.text();
      const root = parse(html);
      const beritaBencana = [];

      // Coba beberapa selector yang mungkin lebih akurat
      const articleLinks = root.querySelectorAll(".article__list__title a");

      // Untuk menghindari duplikat
      const uniqueLinks = new Set();

      articleLinks.forEach((linkElement) => {
        const title = linkElement.textContent.trim();
        const relativeLink = linkElement.getAttribute("href");
        const absoluteLink = new URL(relativeLink, kompasUrl).href;

        if (
          (title.toLowerCase().includes("bencana") ||
            absoluteLink.toLowerCase().includes("bencana")) &&
          !uniqueLinks.has(absoluteLink)
        ) {
          beritaBencana.push({
            title,
            link: absoluteLink,
            source: "Kompas",
          });
          uniqueLinks.add(absoluteLink);
        }
      });

      res.json(beritaBencana);
    } catch (error) {
      console.error("Terjadi kesalahan saat scraping atau parsing:", error);
      res
        .status(500)
        .json({
          error: `Gagal mengambil dan memproses berita: ${error.message}`,
        });
    }
  }

  async getArtikelLengkap(req, res) {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Parameter URL diperlukan" });
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return res
          .status(response.status)
          .json({ error: `Gagal mengambil artikel: ${response.statusText}` });
      }
      const html = await response.text();
      const root = parse(html);

      // Contoh selector untuk Kompas (mungkin perlu disesuaikan)
      const judul = root.querySelector(".read__title")?.textContent.trim();
      const kontenElement = root.querySelector(".read__content");
      let konten = "";

      if (kontenElement) {
        // Hapus elemen yang tidak diinginkan (iklan, script, dll)
        kontenElement
          .querySelectorAll("script, style, iframe, .ad")
          .forEach((el) => el.remove());
        konten = kontenElement.textContent.trim().replace(/\s+/g, " ");
      }

      const tanggal = root
        .querySelector(".read__time")
        ?.getAttribute("datetime");
      const penulis = root
        .querySelector(".read__author__name")
        ?.textContent.trim();

      res.json({
        judul,
        konten,
        tanggal,
        penulis,
        url,
      });
    } catch (error) {
      console.error("Terjadi kesalahan saat scraping artikel:", error);
      res
        .status(500)
        .json({ error: `Gagal mengambil artikel: ${error.message}` });
    }
  }
}
