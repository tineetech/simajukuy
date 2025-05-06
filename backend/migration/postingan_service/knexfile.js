// knexfile.js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'dbpplg.smkn4bogor.sch.id',
      user: 'pplg',
      password: 'adminpplg2025!',
      database: 'simajukuy_post',
      port: 6093,
    },
    migrations: {
      directory: './migrations',
    },
  },
  // mysql -h turntable.proxy.rlwy.net -u root -p ciXFaQEspTttnKcKDyNOPonpVGpXzaWI --port 45766 --protocol=TCP railway
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
