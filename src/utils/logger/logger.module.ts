import { Module } from '@nestjs/common';
import { WinstonLogger } from './WinstonLogger';

@Module({
  providers: [WinstonLogger],
  exports: [WinstonLogger],
})
export class LoggerModule {}
