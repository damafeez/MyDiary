import { Client } from 'pg';
import dotenv from 'dotenv';
import winston from 'winston';
import { devParam, prodParam } from '../config';

dotenv.config();
const dropTables = `
DROP TABLE IF EXISTS authentication cascade;
DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS entries cascade;
DROP TABLE IF EXISTS notificationStatus cascade;
`;
let config;
if (process.env.NODE_ENV === 'development' || 'test') {
  config = devParam;
} else { config = prodParam; }

const client = new Client(config);
client.query(dropTables, (error) => {
  winston.log('error', error);
  client.end();
});
client.connect();
