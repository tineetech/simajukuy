// knexfile.js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'shinkansen.proxy.rlwy.net',
      user: 'root',
      password: 'tDDTcDlfOKVkCRhKnHlvvFNkBraNqxSQ',
      database: 'railway',
      port: 29117,
    },
    migrations: {
      directory: './migrations',
    },
  },
  production: {
    client: 'mysql2',
    connection: {
      host: 'shinkansen.proxy.rlwy.net',  // Ganti dengan host yang benar jika diperlukan
      user: 'root',
      password: 'tDDTcDlfOKVkCRhKnHlvvFNkBraNqxSQ',
      database: 'railway', // pastikan ini sesuai dengan database yang kamu pakai di production
      port: 29117,  // pastikan port sesuai
    },
    migrations: {
      directory: './migrations',
    },
  },
};
