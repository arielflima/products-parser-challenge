import express from 'express';
import './crontasks/cronTasks';
import logger from './utils/logger';
import router from './routes/index';
import util from 'util';
import { SERVER_IS_RUNNING } from './utils/infoMessages';
import { API_PORT } from './infra/constants';

const app = express();
const port = typeof API_PORT === 'string' ? parseInt(API_PORT) : API_PORT;

app.use(express.json());
app.use('/', router);

app.listen(port, () => {
  logger.info(util.format(SERVER_IS_RUNNING, port));
});
