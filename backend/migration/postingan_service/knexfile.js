// knexfile.js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'trolley.proxy.rlwy.net',
      user: 'root',
      password: 'MHsNkntVKxwRlibpvnIEoIlYIiXcUnXi',
      database: 'railway',
      port: 21582,
    },
    migrations: {
      directory: './migrations',
    },
  },
  production: {
    client: 'mysql2',
    connection: {
      host: 'trolley.proxy.rlwy.net',  // Ganti dengan host yang benar jika diperlukan
      user: 'root',
      password: 'MHsNkntVKxwRlibpvnIEoIlYIiXcUnXi',
      database: 'railway', // pastikan ini sesuai dengan database yang kamu pakai di production
      port: 21582,  // pastikan port sesuai
    },
    migrations: {
      directory: './migrations',
    },
  },
};