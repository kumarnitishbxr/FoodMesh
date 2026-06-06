import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { TenantIsolationGuard } from '../infrastructure/http/guards/tenant-isolation.guard';

function createHttpExecutionContext(request: Record<string, unknown>): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: jest.fn(),
      getNext: jest.fn(),
    }),
  } as unknown as ExecutionContext;
}

describe('TenantIsolationGuard', () => {
  const reflector = {
    getAllAndOverride: jest.fn().mockReturnValue(false),
  } as unknown as Reflector;

  let guard: TenantIsolationGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new TenantIsolationGuard(reflector);
  });

  it('allows matching tenant access', () => {
    const request: Record<string, unknown> = {
      user: {
        sub: 'user-1',
        tenantId: 'tenant-1',
        email: 'test@foodmesh.dev',
        role: UserRole.RESTAURANT_OWNER,
        tokenType: 'access',
      },
      headers: {},
      params: { tenantId: 'tenant-1' },
      query: {},
      body: {},
    };

    expect(guard.canActivate(createHttpExecutionContext(request))).toBe(true);
    expect((request as { tenantId?: string }).tenantId).toBe('tenant-1');
  });

  it('rejects cross-tenant access for non-super-admin users', () => {
    const request: Record<string, unknown> = {
      user: {
        sub: 'user-1',
        tenantId: 'tenant-1',
        email: 'test@foodmesh.dev',
        role: UserRole.OUTLET_MANAGER,
        tokenType: 'access',
      },
      headers: { 'x-tenant-id': 'tenant-2' },
      params: {},
      query: {},
      body: {},
    };

    expect(() => guard.canActivate(createHttpExecutionContext(request))).toThrow(
      'Cross-tenant access is not allowed.',
    );
  });

  it('allows super admins to traverse tenants', () => {
    const request: Record<string, unknown> = {
      user: {
        sub: 'user-1',
        tenantId: 'tenant-1',
        email: 'test@foodmesh.dev',
        role: UserRole.SUPER_ADMIN,
        tokenType: 'access',
      },
      headers: { 'x-tenant-id': 'tenant-2' },
      params: {},
      query: {},
      body: {},
    };

    expect(guard.canActivate(createHttpExecutionContext(request))).toBe(true);
    expect((request as { tenantId?: string }).tenantId).toBe('tenant-2');
  });
});
