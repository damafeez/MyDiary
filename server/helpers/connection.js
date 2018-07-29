import dotenv from 'dotenv';
import { Client } from 'pg';
import setupTables from '../migrations/dbSetupQuery';

dotenv.config();

const client = new Client();
client.query(setupTables);
client.connect();

export default client;
