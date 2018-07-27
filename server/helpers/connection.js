import dotenv from 'dotenv';
import { Client } from 'pg';
import { devParam, prodParam } from '../config';

dotenv.config();
let config;

export default function () {
  if (process.env.NODE_ENV === 'development' || 'test') {
    config = devParam;
  } else { config = prodParam; }
  const client = new Client(config);
  return client;
}
