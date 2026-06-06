import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { AuthenticatedUser } from '../../../application/interfaces/authenticated-user.interface';
import { IS_PUBLIC_KEY } from '../../../presentation/http/decorators/public.decorator';
import { SKIP_TENANT_ISOLATION_KEY } from '../../../presentation/http/decorators/skip-tenant-isolation.decorator';

type HttpRequestWithTenant = {
  user?: AuthenticatedUser;
  headers: Record<string, string | string[] | undefined>;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  tenantId?: string;
};

@Injectable()
export class TenantIsolationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const skipTenantIsolation = this.reflector.getAllAndOverride<boolean>(
      SKIP_TENANT_ISOLATION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic || skipTenantIsolation) {
      return true;
    }

    const request = context.switchToHttp().getRequest<HttpRequestWithTenant>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication is required.');
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      request.tenantId = this.extractTenantId(request) ?? user.tenantId;
      return true;
    }

    const routeTenantId = this.extractTenantId(request);

    if (routeTenantId && routeTenantId !== user.tenantId) {
      throw new ForbiddenException('Cross-tenant access is not allowed.');
    }

    request.tenantId = user.tenantId;
    return true;
  }

  private extractTenantId(request: HttpRequestWithTenant): string | undefined {
    const headerTenantId = request.headers['x-tenant-id'];

    if (typeof headerTenantId === 'string' && headerTenantId.length > 0) {
      return headerTenantId;
    }

    const paramsTenantId = this.getStringValue(request.params?.tenantId);
    const queryTenantId = this.getStringValue(request.query?.tenantId);
    const bodyTenantId = this.getStringValue(request.body?.tenantId);

    return paramsTenantId ?? queryTenantId ?? bodyTenantId;
  }

  private getStringValue(value: unknown): string | undefined {
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  }
}
