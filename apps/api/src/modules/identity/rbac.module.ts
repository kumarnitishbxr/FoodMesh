import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './infrastructure/http/guards/permissions.guard';
import { RolesGuard } from './infrastructure/http/guards/roles.guard';
import { RouteAuthGuard } from './infrastructure/http/guards/route-auth.guard';
import { TenantIsolationGuard } from './infrastructure/http/guards/tenant-isolation.guard';
import { RbacService } from './application/authorization/rbac.service';

@Module({
  providers: [
    RbacService,
    {
      provide: APP_GUARD,
      useClass: RouteAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TenantIsolationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    RouteAuthGuard,
    TenantIsolationGuard,
    RolesGuard,
    PermissionsGuard,
  ],
  exports: [
    RbacService,
    RouteAuthGuard,
    TenantIsolationGuard,
    RolesGuard,
    PermissionsGuard,
  ],
})
export class RbacModule {}
