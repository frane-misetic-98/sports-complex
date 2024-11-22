import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('sports-complex');

  app.setGlobalPrefix('/api');

  app.useLogger(logger);

  await app.listen(process.env.PORT ?? 3000);

  logger.log(`Application running on port: ${await app.getUrl()}`);
}

bootstrap();
