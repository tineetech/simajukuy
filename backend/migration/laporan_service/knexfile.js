// knexfile.js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'crossover.proxy.rlwy.net',
      user: 'root',
      password: 'hDluBesfjbRFIdzjPNwUgCMSfLzPlYzc',
      database: 'railway',
      port: 31109,
    },
    migrations: {
      directory: './migrations',
    },
  },
  production: {
    client: 'mysql2',
    connection: {
      host: 'crossover.proxy.rlwy.net',
      user: 'root',
      password: 'hDluBesfjbRFIdzjPNwUgCMSfLzPlYzc',
      database: 'railway',
      port: 31109,
    },
    migrations: {
      directory: './migrations',
    },
  },
};