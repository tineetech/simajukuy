import mysql from 'mysql2'
import dotenv from "dotenv";
dotenv.config();

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 20000, // 20 seconds timeout
})

connection.connect(function(error) {
    if (!!error) {
        console.log('error koneksi mysql gagal : ', error);
    } else {
        console.log('koneksi mysql berhasil')
    }
})

async function ensureConnection() {
    if (connection.state === 'disconnected') {
      await connection.connect();
    }
}

setInterval(() => {
    ensureConnection()
}, 1000)

export default connection