import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PostRouter } from "./routers/post.router.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const PORT = process.env.PORT || 5000;
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

const postinganRouter = new PostRouter().getRouter();

app.use("/api/postingan", postinganRouter);
app.use("/storage/images", express.static(path.join(__dirname, "../storage/images")));
app.use("/storage/videos", express.static(path.join(__dirname, "../storage/videos")));

// Route home
app.get("/", (req, res) => {
  res.status(200).json({ server: 'on', message: 'server is online.' });
});
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});