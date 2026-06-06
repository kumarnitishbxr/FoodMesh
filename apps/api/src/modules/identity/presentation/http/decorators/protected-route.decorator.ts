import { applyDecorators } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Permission } from '../../../application/authorization/permission.enum';
import { Permissions } from './permissions.decorator';
import { Roles } from './roles.decorator';

export interface ProtectedRouteOptions {
  roles?: UserRole[];
  permissions?: Permission[];
}

export function ProtectedRoute(options: ProtectedRouteOptions = {}) {
  const decorators = [];

  if (options.roles?.length) {
    decorators.push(Roles(...options.roles));
  }

  if (options.permissions?.length) {
    decorators.push(Permissions(...options.permissions));
  }

  return applyDecorators(...decorators);
}
