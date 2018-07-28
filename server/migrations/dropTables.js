import { Client } from 'pg';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const dropTables = `
DROP TABLE IF EXISTS authentication cascade;
DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS entries cascade;
DROP TABLE IF EXISTS notificationStatus cascade;
`;

const client = new Client();
client.query(dropTables, (error) => {
  winston.log('error', error);
  client.end();
});
client.connect();
