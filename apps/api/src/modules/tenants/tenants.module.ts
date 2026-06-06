import { Module } from '@nestjs/common';
import { TenantPrismaRepository } from './infrastructure/repositories/tenant-prisma.repository';
import { TenantService } from './application/tenant.service';
import { TenantsController } from './presentation/http/controllers/tenants.controller';

@Module({
  controllers: [TenantsController],
  providers: [TenantService, TenantPrismaRepository],
  exports: [TenantService, TenantPrismaRepository],
})
export class TenantsModule {}
