import { UserRole } from '@prisma/client';
import { Permission } from '../application/authorization/permission.enum';
import { RbacService } from '../application/authorization/rbac.service';

describe('RbacService', () => {
  let service: RbacService;

  beforeEach(() => {
    service = new RbacService();
  });

  it('grants all permissions to super admins', () => {
    expect(service.hasPermissions(UserRole.SUPER_ADMIN, [Permission.AUDIT_READ])).toBe(true);
  });

  it('rejects permissions not granted to staff', () => {
    expect(service.hasPermissions(UserRole.STAFF, [Permission.BILLING_WRITE])).toBe(false);
  });

  it('matches roles correctly', () => {
    expect(service.hasRole(UserRole.OUTLET_MANAGER, [UserRole.OUTLET_MANAGER])).toBe(true);
    expect(service.hasRole(UserRole.STAFF, [UserRole.OUTLET_MANAGER])).toBe(false);
  });
});
