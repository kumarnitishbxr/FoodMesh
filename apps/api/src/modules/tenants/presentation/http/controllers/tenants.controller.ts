import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Permission } from '../../../../identity/application/authorization/permission.enum';
import { AuthenticatedUser } from '../../../../identity/application/interfaces/authenticated-user.interface';
import { CurrentUser } from '../../../../identity/presentation/http/decorators/current-user.decorator';
import { ProtectedRoute } from '../../../../identity/presentation/http/decorators/protected-route.decorator';
import { SkipTenantIsolation } from '../../../../identity/presentation/http/decorators/skip-tenant-isolation.decorator';
import { TenantService } from '../../application/tenant.service';
import { AssignSubscriptionDto } from '../dto/assign-subscription.dto';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { UpdateTenantDto } from '../dto/update-tenant.dto';
import {
  ApiAssignSubscription,
  ApiCreateTenant,
  ApiDeleteTenant,
  ApiTenantDetails,
  ApiUpdateTenant,
} from '../swagger/tenant.swagger';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @SkipTenantIsolation()
  @ProtectedRoute({
    roles: [UserRole.SUPER_ADMIN],
    permissions: [Permission.TENANT_WRITE],
  })
  @ApiCreateTenant()
  createTenant(
    @Body() dto: CreateTenantDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.tenantService.createTenant(dto, user);
  }

  @Get(':tenantId')
  @ProtectedRoute({
    roles: [UserRole.SUPER_ADMIN, UserRole.RESTAURANT_OWNER],
    permissions: [Permission.TENANT_READ],
  })
  @ApiTenantDetails()
  getTenantDetails(@Param('tenantId') tenantId: string) {
    return this.tenantService.getTenantDetails(tenantId);
  }

  @Patch(':tenantId')
  @ProtectedRoute({
    roles: [UserRole.SUPER_ADMIN, UserRole.RESTAURANT_OWNER],
    permissions: [Permission.TENANT_WRITE],
  })
  @ApiUpdateTenant()
  updateTenant(
    @Param('tenantId') tenantId: string,
    @Body() dto: UpdateTenantDto,
  ) {
    return this.tenantService.updateTenant(tenantId, dto);
  }

  @Delete(':tenantId')
  @ProtectedRoute({
    roles: [UserRole.SUPER_ADMIN],
    permissions: [Permission.TENANT_WRITE],
  })
  @ApiDeleteTenant()
  deleteTenant(@Param('tenantId') tenantId: string) {
    return this.tenantService.deleteTenant(tenantId);
  }

  @Post(':tenantId/subscriptions')
  @ProtectedRoute({
    roles: [UserRole.SUPER_ADMIN, UserRole.RESTAURANT_OWNER],
    permissions: [Permission.BILLING_WRITE, Permission.TENANT_WRITE],
  })
  @ApiAssignSubscription()
  assignSubscription(
    @Param('tenantId') tenantId: string,
    @Body() dto: AssignSubscriptionDto,
  ) {
    return this.tenantService.assignSubscription(tenantId, dto);
  }
}
