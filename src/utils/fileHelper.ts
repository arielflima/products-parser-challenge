import axios from 'axios';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { FOOD_DATA_INDEX_URL, FOOD_DATA_BASE_URL } from '../infra/constants';
import logger from './logger';
import {
  ERROR_DOWNLOAD_FILE,
  ERROR_EXTRACT_FILE,
  ERROR_FETCH_INDEX_FILE,
} from './errorMessages';
import util from 'util';
import { parser } from 'stream-json';
import { streamObject } from 'stream-json/streamers/StreamObject';
import { Product } from '@prisma/client';

export async function downloadAndExtractFile(
  filename: string,
): Promise<string> {
  const filePath = await downloadFile(filename);
  const extractedFilePath = await extractFile(filePath, filename);
  return extractedFilePath;
}

export async function downloadFile(filename: string): Promise<string> {
  const fileUrl = `${FOOD_DATA_BASE_URL}${filename}`;
  const filePath = path.resolve(__dirname, '..', filename);

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
    return filePath;
  } catch (error) {
    logger.error(util.format(ERROR_DOWNLOAD_FILE, filename), error);
    throw error;
  }
}

export async function extractFile(
  filePath: string,
  filename: string,
): Promise<string> {
  const extractedFilePath = path.resolve(
    path.dirname(filePath),
    `${path.basename(filename, '.gz')}`,
  );
  try {
    const fileContents = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(extractedFilePath);
    const unzip = zlib.createGunzip();

    fileContents.pipe(unzip).pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    logger.info(`File ${filePath} extracted successfully.`);
    return extractedFilePath;
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

export async function fetchProductsFromJsonFile(
  filePath: string,
  limit: number,
  skip: number = 0,
): Promise<{ products: Product[]; isEndOfFile: boolean }> {
  return new Promise((resolve, reject) => {
    const products: Product[] = [];
    let currentProduct: Partial<Product> = {};
    let isEndOfFile = false;

    const pipeline = fs
      .createReadStream(filePath)
      .pipe(parser({ jsonStreaming: true }))
      .pipe(streamObject());

    let counter = 0;
    pipeline.on('data', ({ key, value }) => {
      currentProduct[key as keyof Product] = value;
      if (key === 'carnitine_100g') {
        counter++;
        if (products.length < limit) {
          if (counter > skip) {
            products.push(currentProduct as Product);
            currentProduct = {};
          }
        } else {
          pipeline.destroy();
        }
      }
    });

    pipeline.on('end', () => {
      isEndOfFile = true;
      resolve({ products, isEndOfFile });
    });

    pipeline.on('error', (error) => {
      logger.error(
        `Error importing JSON file ${filePath} to the database:`,
        error,
      );
      reject(error);
    });

    pipeline.on('close', () => {
      resolve({ products, isEndOfFile });
    });
  });
}
