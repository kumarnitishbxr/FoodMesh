import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { MessageResponseDto } from '../../../../identity/presentation/http/dto/message-response.dto';
import { AssignSubscriptionDto } from '../dto/assign-subscription.dto';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { TenantDetailDto } from '../dto/tenant-detail.dto';
import { UpdateTenantDto } from '../dto/update-tenant.dto';

const tenantIdParam = ApiParam({
  name: 'tenantId',
  description: 'Tenant UUID',
  format: 'uuid',
});

export function ApiCreateTenant() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a tenant' }),
    ApiBearerAuth('access-token'),
    ApiBody({ type: CreateTenantDto }),
    ApiCreatedResponse({ type: TenantDetailDto }),
  );
}

export function ApiTenantDetails() {
  return applyDecorators(
    ApiOperation({ summary: 'Get tenant details' }),
    ApiBearerAuth('access-token'),
    tenantIdParam,
    ApiOkResponse({ type: TenantDetailDto }),
  );
}

export function ApiUpdateTenant() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a tenant' }),
    ApiBearerAuth('access-token'),
    tenantIdParam,
    ApiBody({ type: UpdateTenantDto }),
    ApiOkResponse({ type: TenantDetailDto }),
  );
}

export function ApiDeleteTenant() {
  return applyDecorators(
    ApiOperation({ summary: 'Soft delete a tenant' }),
    ApiBearerAuth('access-token'),
    tenantIdParam,
    ApiOkResponse({ type: MessageResponseDto }),
  );
}

export function ApiAssignSubscription() {
  return applyDecorators(
    ApiOperation({ summary: 'Assign a subscription to a tenant' }),
    ApiBearerAuth('access-token'),
    tenantIdParam,
    ApiBody({ type: AssignSubscriptionDto }),
    ApiOkResponse({ type: TenantDetailDto }),
  );
}
