import express from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import { ArtikelRouter } from "./routers/artikel.router.js";

const PORT = process.env.PORT || 5001;
const base_url_fe = process.env.FE_URL;

const app = express();

app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const artikelRouter = new ArtikelRouter().getRouter();
app.use("/api/berita", artikelRouter);

// Route home
app.get("/", (req, res) => {
  res.status(200).json({ server: 'on', message: 'server is online.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});