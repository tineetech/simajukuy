// knexfile.js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'centerbeam.proxy.rlwy.net',
      user: 'root',
      password: 'CdDuUGcmxWUMrTSIbNyovUUqReCVbRDc',
      database: 'railway',
      port: 51401,
    },
    migrations: {
      directory: './migrations',
    },
  },
  production: {
    client: 'mysql2',
    connection: {
      host: 'centerbeam.proxy.rlwy.net',  // Ganti dengan host yang benar jika diperlukan
      user: 'root',
      password: 'CdDuUGcmxWUMrTSIbNyovUUqReCVbRDc',
      database: 'railway', // pastikan ini sesuai dengan database yang kamu pakai di production
      port: 51401,  // pastikan port sesuai
    },
    migrations: {
      directory: './migrations',
    },
  },
};