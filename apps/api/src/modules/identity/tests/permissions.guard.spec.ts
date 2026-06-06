import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { Permission } from '../application/authorization/permission.enum';
import { RbacService } from '../application/authorization/rbac.service';
import { PermissionsGuard } from '../infrastructure/http/guards/permissions.guard';

function createExecutionContext(userRole: UserRole): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({
        user: {
          sub: 'user-1',
          tenantId: 'tenant-1',
          email: 'test@foodmesh.dev',
          role: userRole,
          tokenType: 'access',
        },
      }),
    }),
  } as unknown as ExecutionContext;
}

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;

  beforeEach(() => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Permission.BILLING_READ]),
    } as unknown as Reflector;
    guard = new PermissionsGuard(reflector, new RbacService());
  });

  it('allows users with required permissions', () => {
    expect(guard.canActivate(createExecutionContext(UserRole.RESTAURANT_OWNER))).toBe(true);
  });

  it('rejects users without required permissions', () => {
    expect(() => guard.canActivate(createExecutionContext(UserRole.STAFF))).toThrow(
      'You do not have the required permissions.',
    );
  });
});
