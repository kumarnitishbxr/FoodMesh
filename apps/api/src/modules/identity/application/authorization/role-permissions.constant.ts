import { UserRole } from '@prisma/client';
import { Permission } from './permission.enum';

const allPermissions = Object.values(Permission);

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: allPermissions,
  [UserRole.RESTAURANT_OWNER]: [
    Permission.TENANT_READ,
    Permission.USER_READ,
    Permission.USER_WRITE,
    Permission.RESTAURANT_READ,
    Permission.RESTAURANT_WRITE,
    Permission.OUTLET_READ,
    Permission.OUTLET_WRITE,
    Permission.MENU_READ,
    Permission.MENU_WRITE,
    Permission.INVENTORY_READ,
    Permission.INVENTORY_WRITE,
    Permission.ORDER_READ,
    Permission.ORDER_WRITE,
    Permission.PAYMENT_READ,
    Permission.PAYMENT_WRITE,
    Permission.NOTIFICATION_READ,
    Permission.NOTIFICATION_WRITE,
    Permission.AUDIT_READ,
    Permission.BILLING_READ,
    Permission.BILLING_WRITE,
  ],
  [UserRole.OUTLET_MANAGER]: [
    Permission.OUTLET_READ,
    Permission.OUTLET_WRITE,
    Permission.MENU_READ,
    Permission.MENU_WRITE,
    Permission.INVENTORY_READ,
    Permission.INVENTORY_WRITE,
    Permission.ORDER_READ,
    Permission.ORDER_WRITE,
    Permission.PAYMENT_READ,
    Permission.NOTIFICATION_READ,
    Permission.NOTIFICATION_WRITE,
  ],
  [UserRole.STAFF]: [
    Permission.MENU_READ,
    Permission.INVENTORY_READ,
    Permission.ORDER_READ,
    Permission.ORDER_WRITE,
    Permission.NOTIFICATION_READ,
  ],
};
