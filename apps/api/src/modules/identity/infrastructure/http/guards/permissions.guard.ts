import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedUser } from '../../../application/interfaces/authenticated-user.interface';
import { RbacService } from '../../../application/authorization/rbac.service';
import { Permission } from '../../../application/authorization/permission.enum';
import { PERMISSIONS_KEY } from '../../../presentation/http/decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RbacService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication is required.');
    }

    if (!this.rbacService.hasPermissions(user.role, requiredPermissions)) {
      throw new ForbiddenException('You do not have the required permissions.');
    }

    return true;
  }
}
