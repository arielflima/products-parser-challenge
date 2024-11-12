import { createLogger, format, transports } from 'winston';
import { format as formatDate, toZonedTime } from 'date-fns-tz';
import { TIMEZONE, DATE_MASK_DEFAULT } from '../infra/constants';

const timezoned = () => {
  const date = new Date();
  const zonedDate = toZonedTime(date, TIMEZONE);
  return formatDate(zonedDate, DATE_MASK_DEFAULT, {
    timeZone: TIMEZONE,
  });
};

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: timezoned,
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});

logger.add(
  new transports.Console({
    format: format.combine(format.colorize(), format.simple()),
  }),
);

export default logger;
