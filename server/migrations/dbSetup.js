import { Client } from 'pg';
import dotenv from 'dotenv';
import winston from 'winston';
import { devParam, prodParam } from '../config';
import {
  users, authentication, entries, notificationStatus,
} from './dbSetupQuery';

dotenv.config();

let config;
if (process.env.NODE_ENV === 'development' || 'test') {
  config = devParam;
} else { config = prodParam; }

const client = new Client(config);
client.query(`${authentication}${users}${entries}${notificationStatus}`, (error) => {
  console.log('error', error);
  client.end();
});
client.connect();
