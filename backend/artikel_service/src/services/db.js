// import mysql from 'mysql2/promise'; // Gunakan promise-based
// import dotenv from "dotenv";
// dotenv.config();

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     port: process.env.DB_PORT,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     connectionLimit: 20,
//     waitForConnections: true,
//     queueLimit: 1000,
//     connectTimeout: 10000,
//     idleTimeout: 60000 // Tutup koneksi idle setelah 60 detik
// });

// // Health check periodic
// setInterval(async () => {
//     try {
//         const conn = await pool.getConnection();
//         await conn.ping();
//         conn.release();
//     } catch (err) {
//         console.error('Database health check failed:', err);
//     }
// }, 30000); // Setiap 30 detik

// export default pool;