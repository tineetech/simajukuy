// knexfile.js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'tokala.iixcp.rumahweb.net',
      user: 'indy4153_simkuy',
      password: 'simajukuyEPDB00!',
      database: 'indy4153_simajukuy_laporan',
      port: 2083,
    },
    migrations: {
      directory: './migrations',
    },
  },
};