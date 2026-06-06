import {
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
  Tenant,
  TenantStatus,
} from '@prisma/client';

export type CreateTenantInput = {
  name: string;
  slug: string;
  primaryEmail: string;
  primaryPhone?: string | null;
  timezone: string;
  currencyCode: string;
  metadata?: Record<string, unknown> | null;
};

export type UpdateTenantInput = {
  name?: string;
  primaryEmail?: string;
  primaryPhone?: string | null;
  timezone?: string;
  currencyCode?: string;
  status?: TenantStatus;
  metadata?: Record<string, unknown> | null;
};

export type AssignSubscriptionInput = {
  tenantId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startsAt: Date;
  endsAt?: Date | null;
  trialEndsAt?: Date | null;
  seats: number;
  priceMinor: number;
  currencyCode: string;
  metadata?: Record<string, unknown> | null;
};

export type TenantWithSubscriptions = Tenant & {
  subscriptions: Subscription[];
};
