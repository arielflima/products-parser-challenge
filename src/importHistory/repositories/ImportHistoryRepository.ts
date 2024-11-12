import prisma from '../../infra/prismaClient';
import { Prisma } from '@prisma/client';

export default class ImportHistoryRepository {
  static async create(importHistory: Prisma.ImportHistoryCreateInput) {
    return prisma.importHistory.create({
      data: importHistory,
    });
  }

  static async findLast() {
    return prisma.importHistory.findFirst({
      orderBy: { importDate: 'desc' },
    });
  }
}
