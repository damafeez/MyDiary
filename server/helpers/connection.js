import dotenv from 'dotenv';
import { Client } from 'pg';
import setupTables from '../migrations/dbSetupQuery';

dotenv.config();

export default function () {
  const client = new Client();
  client.query(setupTables);
  client.connect();
  return client;
}
