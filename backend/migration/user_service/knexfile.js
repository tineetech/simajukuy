// knexfile.js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'yamanote.proxy.rlwy.net',
      user: 'root',
      password: 'PMcoWXdYMTwKhSlgzctVwfWqXggDVXXf',
      database: 'railway',
      port: 14246,
    },
    migrations: {
      directory: './migrations',
    },
  },
};
