import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(ConfigService);
  
  await app.listen(configService.get('PORT') ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
