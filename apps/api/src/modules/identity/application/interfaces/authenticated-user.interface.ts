import { UserRole } from '@prisma/client';

export interface AuthenticatedUser {
  sub: string;
  tenantId: string;
  email: string;
  role: UserRole;
  restaurantId?: string | null;
  outletId?: string | null;
  tokenType: 'access' | 'refresh';
  refreshToken?: string;
}
