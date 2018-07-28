import { Client } from 'pg';
import dotenv from 'dotenv';
import setupTables from './dbSetupQuery';

dotenv.config();

const client = new Client();
client.query(setupTables, (error) => {
  console.log('error', error);
  client.end();
});
client.connect();
