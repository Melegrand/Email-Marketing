import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();
const client = new pg.Client(
  {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  }
);
client.connect();
export default client;