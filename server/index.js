import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import api from './routes';

const PORT = process.env.PORT || 3000;

const app = express();

app
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', api);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

export default app;
