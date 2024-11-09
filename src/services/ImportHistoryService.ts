import { create } from '../repositories/ImportHistoryRepository';
import { ImportHistoryStatus } from '@prisma/client';
import {
  FILENAME_REQUIRED,
  STATUS_REQUIRED,
  ERROR_MESSAGE_REQUIRED,
} from '../utils/errorMessages';

export async function createLogImport(
  filename: string,
  status: ImportHistoryStatus,
  errorMessage?: string,
): Promise<void> {
  validateLogImport(filename, status, errorMessage);
  await create({ filename, status, errorMessage });
}

function validateLogImport(
  filename: string,
  status: ImportHistoryStatus,
  errorMessage?: string,
): void {
  if (!filename) {
    throw new Error(FILENAME_REQUIRED);
  }
  if (!status) {
    throw new Error(STATUS_REQUIRED);
  }
  if (status === ImportHistoryStatus.FAILED && !errorMessage) {
    throw new Error(ERROR_MESSAGE_REQUIRED);
  }
}
