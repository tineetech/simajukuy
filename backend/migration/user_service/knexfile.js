// knexfile.js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'nozomi.proxy.rlwy.net',
      user: 'root',
      password: 'BoKvzwOmSrEwAGEgWNnzsZcgBqpCMtRG',
      database: 'railway',
      port: 50887,
    },
    migrations: {
      directory: './migrations',
    },
  },
};
//mysql -h nozomi.proxy.rlwy.net -u root -p BoKvzwOmSrEwAGEgWNnzsZcgBqpCMtRG --port 50887 --protocol=TCP railway