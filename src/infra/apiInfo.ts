import prisma from './prismaClient';
import { Request, Response } from 'express';
import ImportHistoryService from '../importHistory/services/ImportHistoryService';
import { toZonedTime, format } from 'date-fns-tz';
import {
  NO_CRON_EXECUTION_YET,
  API_WELCOME_MESSAGE,
} from '../utils/infoMessages';
import { TIMEZONE, DATE_MASK_DEFAULT } from './constants';

async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { read: true, write: true };
  } catch {
    return { read: false, write: false };
  }
}

export async function apiInfo(req: Request, res: Response) {
  const lastCronExecution = await ImportHistoryService.getLastImport();
  const importDate = lastCronExecution?.importDate;

  const formattedLastCronExecution = importDate
    ? format(toZonedTime(importDate, TIMEZONE), DATE_MASK_DEFAULT, {
        timeZone: TIMEZONE,
      })
    : NO_CRON_EXECUTION_YET;

  const dbStatus = await checkDatabaseConnection();
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.json({
    message: API_WELCOME_MESSAGE,
    database: dbStatus,
    lastCronExecution: formattedLastCronExecution,
    uptime: `${Math.floor(uptime / 60)} minutes, ${Math.floor(uptime % 60)} seconds`,
    memoryUsage: {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
    },
  });
}
