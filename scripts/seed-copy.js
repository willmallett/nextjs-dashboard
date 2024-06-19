const { db } = require('@vercel/postgres');
const pg = require('pg');

async function main() {
  const config = {
    user: 'dashboard_api',
    database: 'dashboardapidb',
    password: 'dashboard_api_ps',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
  };

  // const pool = new pg.Pool(config);
  //
  // pool.connect(function(err, client, done) {
  //   if(err) {
  //     return console.error('error fetching client from pool', err);
  //   }
  //
  //   const createUsersSql = `
  //     CREATE TABLE IF NOT EXISTS dashboard.users (
  //         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  //         name VARCHAR(255) NOT NULL,
  //         email TEXT NOT NULL UNIQUE,
  //         password TEXT NOT NULL
  //     );
  //   `;
  //
  //   client.query(createUsersSql, [], function(err, result) {
  //     done();
  //
  //     if(err) {
  //       return console.error('error running query', err);
  //     }
  //
  //     console.log(JSON.stringify(result, null, 2));
  //   });
  // });
  //
  // pool.on('error', function (err, client) {
  //   console.error('idle client error', err.message, err.stack)
  // });
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
