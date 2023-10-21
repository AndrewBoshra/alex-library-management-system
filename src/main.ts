import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DomainExceptionFilter } from '@common/exceptions/domain-exception.filter';

function initSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Alex Library API')
    .setVersion('1.0')
    .addTag('Library')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
}

function initValidation(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // transform payload to DTO
      enableDebugMessages: true,
      forbidNonWhitelisted: true, // throw error if payload contains non-whitelisted properties
      transformOptions: {
        enableImplicitConversion: true, // convert string to number
      },
    }),
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  initSwagger(app);
  initValidation(app);

  app.useGlobalFilters(new DomainExceptionFilter());

  const port = configService.get('PORT') || 3000;
  await app.listen(port, () => console.log(`Server running on port ${port}`));
}
bootstrap();
