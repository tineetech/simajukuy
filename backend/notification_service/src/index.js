import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AuthRouter } from "./routers/auth.router.js";
import { InferenceClient } from "@huggingface/inference";
import { AnalisisRouter } from "./routers/analisis.router.js";
import { UsersRouter } from "./routers/users.router.js";
import { NotifRouter } from "./routers/notif.router.js";
import { LaporanRouter } from "./routers/laporan.router.js";
import { PostRouter } from "./routers/post.router.js";

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

const authRouter = new AuthRouter().getRouter();
const usersRouter = new UsersRouter().getRouter();
const notifRouter = new NotifRouter().getRouter();
const laporanRouter = new LaporanRouter().getRouter();
const postinganRouter = new PostRouter().getRouter();
const analisisRouter = new AnalisisRouter().getRouter();
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/notification", notifRouter);
app.use("/api/laporan", laporanRouter);
app.use("/api/postingan", postinganRouter);
app.use('/api/analisis', analisisRouter)

// Route home
app.get("/", (req, res) => {
  res.status(200).json({ server: 'on', message: 'server is online.' });
});
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});