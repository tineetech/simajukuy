// knexfile.js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'shuttle.proxy.rlwy.net',
      user: 'root',
      password: 'AkQCLNuIDsnhfxVNnbkWUfnhFgvuRRre',
      database: 'railway',
      port: 26922,
    },
    migrations: {
      directory: './migrations',
    },
  },
};



