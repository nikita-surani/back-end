import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;

export const winston = createLogger({
  format: combine(
    timestamp(),
    colorize({ level: true, message: true }),
    printf(
      (info: any) => `[${info.timestamp}] : ${info.level}: ${info.message}`,
    ),
  ),
  exitOnError: false,
  transports: [new transports.Console()],
});
