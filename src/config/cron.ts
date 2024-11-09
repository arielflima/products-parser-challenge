import cron from 'node-cron';
import {
  fetchIndexFile,
  downloadAndExtractFile,
} from '../services/FileService';
import logger from '../config/logger';

async function executeCronTask() {
  try {
    const filenames = await fetchIndexFile();
    for (const filename of filenames) {
      await downloadAndExtractFile(filename);
    }
  } catch (error) {
    logger.error('Error in main process:', error);
  }
}

cron.schedule('0 2 * * *', async () => {
  logger.info('Executing cron task...');
  await executeCronTask();
});

logger.info('Cron task scheduled.');
