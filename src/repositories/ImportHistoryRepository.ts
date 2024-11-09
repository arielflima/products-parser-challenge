import prisma from '../config/prismaClient';
import { Prisma } from '@prisma/client';

export async function create(
  importHistory: Prisma.ImportHistoryCreateInput,
): Promise<void> {
  await prisma.importHistory.create({
    data: importHistory,
  });
}
