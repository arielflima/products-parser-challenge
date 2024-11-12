import cron from 'node-cron';
import { ProductService } from '../products/services/ProductService';
import logger from '../utils/logger';

async function executeCronTask() {
  try {
    await ProductService.importProducts();
  } catch (error) {
    logger.error('Error in cron task:', error);
  }
}

cron.schedule('0 2 * * *', async () => {
  logger.info('Executing cron task...');
  await executeCronTask();
});

logger.info('Cron task scheduled.');
