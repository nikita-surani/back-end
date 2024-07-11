/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { swaggerLoader } from './utils/swagger';

async function bootstrap(): Promise<any> {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  swaggerLoader(app);
  await app.listen(3000);
}
bootstrap();
