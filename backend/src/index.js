// Import package yang dibutuhkan
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load .env file (jika ada)
dotenv.config();

// Inisialisasi express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Untuk parsing JSON request

// Route test
app.get("/", (req, res) => {
  res.send("🚀 Backend Express is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
