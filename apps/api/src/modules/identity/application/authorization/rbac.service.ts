import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Permission } from './permission.enum';
import { ROLE_PERMISSIONS } from './role-permissions.constant';

@Injectable()
export class RbacService {
  getPermissionsForRole(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] ?? [];
  }

  hasRole(role: UserRole, allowedRoles: UserRole[]): boolean {
    if (role === UserRole.SUPER_ADMIN) {
      return true;
    }

    return allowedRoles.length === 0 || allowedRoles.includes(role);
  }

  hasPermissions(role: UserRole, requiredPermissions: Permission[]): boolean {
    if (requiredPermissions.length === 0) {
      return true;
    }

    const grantedPermissions = new Set(this.getPermissionsForRole(role));

    return requiredPermissions.every((permission) => grantedPermissions.has(permission));
  }
}
