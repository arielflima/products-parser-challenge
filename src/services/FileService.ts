import axios from 'axios';
import fs from 'fs';
import path from 'path';
import tar from 'tar';
import {
  FOOD_DATA_INDEX_URL,
  FOOD_DATA_BASE_URL,
  DOWNLOAD_DIR,
} from '../config/constants';
import { createLogImport } from './ImportHistoryService';
import { ImportHistoryStatus } from '@prisma/client';
import logger from '../config/logger';
import {
  ERROR_DOWNLOAD_FILE,
  ERROR_EXTRACT_FILE,
  ERROR_FETCH_INDEX_FILE,
} from '../utils/errorMessages';
import { FILE_DOWNLOAD_SUCCESS } from '../utils/infoMessages';
import util from 'util';

export async function downloadAndExtractFile(filename: string): Promise<void> {
  try {
    const filePath = await downloadFile(filename);
    await extractFile(filePath);
    await createLogImport(filename, ImportHistoryStatus.SUCCESS);
  } catch (error) {
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }
    await createLogImport(filename, ImportHistoryStatus.FAILED, errorMessage);
    logger.error(util.format(ERROR_DOWNLOAD_FILE, filename, error));
  }
}

export async function downloadFile(filename: string): Promise<string> {
  const fileUrl = `${FOOD_DATA_BASE_URL}${filename}`;
  const filePath = path.resolve(__dirname, '..', DOWNLOAD_DIR, filename);

  try {
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream',
    });

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    logger.info(util.format(FILE_DOWNLOAD_SUCCESS, filename));
    return filePath;
  } catch (error) {
    logger.error(util.format(ERROR_DOWNLOAD_FILE, filename), error);
    throw error;
  }
}

export async function extractFile(filePath: string): Promise<void> {
  try {
    await tar.x({
      file: filePath,
      cwd: path.dirname(filePath),
    });

    logger.info(`File ${filePath} extracted successfully.`);
  } catch (error) {
    logger.error(util.format(ERROR_EXTRACT_FILE, filePath, error));
    throw error;
  }
}

export async function fetchIndexFile(): Promise<string[]> {
  try {
    const response = await axios.get(FOOD_DATA_INDEX_URL);
    return response.data
      .split('\n')
      .filter((line: string) => line.trim() !== '');
  } catch (error) {
    logger.error(ERROR_FETCH_INDEX_FILE, error);
    throw error;
  }
}
