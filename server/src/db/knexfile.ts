export default {
  development: {
    client: 'pg',
    connection: process.env.POSTGRESQL_URL,
    // connection: {
    //   host: '',
    //   database: '',
    //   user: '',
    //   password: '',
    // },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds/dev',
    },
    timezone: 'UTC',
  },
  // testing: {
  //   client: 'pg',
  //   connection: {
  //     database: "my_db",
  //     user: "username",
  //     password: "password"
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations',
  //     directory: 'migrations'
  //   },
  //   timezone: 'UTC'
  // },
  // production: {
  //   client: 'pg',
  //   connection: {
  //     database: "my_db",
  //     user: "username",
  //     password: "password"
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations',
  //     directory: 'migrations'
  //   },
  //   timezone: 'UTC'
  // }
};
