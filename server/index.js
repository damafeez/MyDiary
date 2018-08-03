import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import winston from 'winston';
import swaggerUi from 'swagger-ui-express';
import api from './routes';
import documentation from '../swagger';

const PORT = process.env.PORT || 3030;

const app = express();

app
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));

app.set('json spaces', 2);

app.use('/api/v1', api);

const swaggerOption = {
  customCss: '.swagger-ui .topbar { display: none }',
};
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentation, swaggerOption));

app.listen(PORT, () => winston.log('server status', `server is running on port ${PORT}, NODE_ENV: ${process.env.NODE_ENV}`));

export default app;
