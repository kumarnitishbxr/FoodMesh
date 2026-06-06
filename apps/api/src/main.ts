import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './bootstrap/filters/global-exception.filter';
import { ResponseInterceptor } from './bootstrap/interceptors/response.interceptor';
import { WinstonLogger } from './bootstrap/logger/winston.logger';
import { GlobalValidationPipe } from './bootstrap/pipes/global-validation.pipe';
import { PrismaService } from './common/persistence/prisma.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logger = app.get(WinstonLogger);
  const prismaService = app.get(PrismaService);
  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api/v1';
  const port = configService.get<number>('app.port') ?? 3000;

  app.useLogger(logger);
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(new GlobalValidationPipe());
  app.useGlobalFilters(app.get(GlobalExceptionFilter));
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FoodMesh API')
    .setDescription('FoodMesh REST API')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refresh-token',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, swaggerDocument);

  await prismaService.enableShutdownHooks(app);
  await app.listen(port);

  logger.log(`FoodMesh API listening on port ${port}`, 'Bootstrap');
}

bootstrap();
