// knexfile.js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'dbpplg.smkn4bogor.sch.id',
      user: 'pplg',
      password: 'adminpplg2025!',
      database: 'simajukuy_user',
      port: 6093,
    },
    migrations: {
      directory: './migrations',
    },
  },
};
//mysql -h nozomi.proxy.rlwy.net -u root -p BoKvzwOmSrEwAGEgWNnzsZcgBqpCMtRG --port 50887 --protocol=TCP railway