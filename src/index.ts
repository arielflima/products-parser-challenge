import express from 'express';
import './config/cron';
import logger from './config/logger';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
