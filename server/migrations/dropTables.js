import { Client } from 'pg';
import dotenv from 'dotenv';
import { dropTables } from './dbSetupQuery';

dotenv.config();

const client = new Client();
client.query(dropTables, (error) => {
  console.log('error', error);
  client.end();
});
client.connect();
