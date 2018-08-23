import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import webPush from 'web-push';
import swaggerUi from 'swagger-ui-express';
import { dailyReminder } from './helpers/utils';
import api from './routes';
import documentation from '../swagger';

dotenv.config();

const PORT = process.env.PORT || 3030;

const app = express();

app
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));

app.set('json spaces', 2);

webPush.setVapidDetails(
  'mailto:damafeez@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);
dailyReminder().start();
console.log('next dates', dailyReminder().nextDates());

app.use('/api/v1', api);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentation, { customCss: '.swagger-ui .topbar { display: none }' }));

app.listen(PORT, () => console.log('server status', `server is running on port ${PORT}, NODE_ENV: ${process.env.NODE_ENV}`));

export default app;
