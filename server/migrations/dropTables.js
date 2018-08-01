import { Client } from 'pg';
import winston from 'winston';
import dotenv from 'dotenv';
import { dropTables } from './dbSetupQuery';

dotenv.config();

const client = new Client();
client.query(dropTables, (error) => {
  winston.log('error', error);
  client.end();
});
client.connect();
