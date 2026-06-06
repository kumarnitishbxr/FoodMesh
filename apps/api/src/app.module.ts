import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './bootstrap/config/app.config';
import { GlobalExceptionFilter } from './bootstrap/filters/global-exception.filter';
import { WinstonLogger } from './bootstrap/logger/winston.logger';
import { DatabaseModule } from './common/database.module';
import { IdentityModule } from './modules/identity/identity.module';
import { HealthModule } from './modules/platform/health/health.module';
import { TenantsModule } from './modules/tenants/tenants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    DatabaseModule,
    IdentityModule,
    HealthModule,
    TenantsModule,
  ],
  providers: [WinstonLogger, GlobalExceptionFilter],
})
export class AppModule {}
