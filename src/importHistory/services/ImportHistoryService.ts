import { ImportHistoryStatus, ImportHistory } from '@prisma/client';
import {
  FILENAME_REQUIRED,
  STATUS_REQUIRED,
  ERROR_MESSAGE_REQUIRED,
} from '../../utils/errorMessages';
import ImportHistoryRepository from '../repositories/ImportHistoryRepository';

export default class ImportHistoryService {
  static async createLogImport(
    filename: string,
    status: ImportHistoryStatus,
    errorMessage?: string,
  ): Promise<void> {
    this.validateLogImport(filename, status, errorMessage);
    await ImportHistoryRepository.create({ filename, status, errorMessage });
  }

  private static validateLogImport(
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

  static async getLastImport(): Promise<ImportHistory | null> {
    return ImportHistoryRepository.findLast();
  }
}
