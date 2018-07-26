import dotenv from 'dotenv';

dotenv.config();

const devParam = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
};
const prodParam = { database: process.env.DATABASE_URL };
export { devParam, prodParam };
