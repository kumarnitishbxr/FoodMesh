import { Injectable } from '@nestjs/common';
import { Prisma, Subscription, SubscriptionStatus, Tenant } from '@prisma/client';
import { PrismaService } from '../../../../common/persistence/prisma.service';
import { BaseRepository } from '../../../../common/repositories/base.repository';
import {
  AssignSubscriptionInput,
  CreateTenantInput,
  TenantWithSubscriptions,
  UpdateTenantInput,
} from '../../application/tenant.types';

@Injectable()
export class TenantPrismaRepository extends BaseRepository<
  Tenant,
  Prisma.TenantFindManyArgs,
  Prisma.TenantFindUniqueArgs,
  Prisma.TenantCreateArgs,
  Prisma.TenantUpdateArgs,
  Prisma.TenantUpdateManyArgs
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.tenant);
  }

  findTenantById(id: string): Promise<Tenant | null> {
    return this.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  findTenantBySlug(slug: string): Promise<Tenant | null> {
    return this.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
    });
  }

  findTenantDetailsById(id: string): Promise<TenantWithSubscriptions | null> {
    return this.prisma.tenant.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        subscriptions: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  createTenant(input: CreateTenantInput): Promise<Tenant> {
    return this.create({
      data: {
        name: input.name,
        slug: input.slug,
        primaryEmail: input.primaryEmail,
        primaryPhone: input.primaryPhone,
        timezone: input.timezone,
        currencyCode: input.currencyCode,
        metadata: input.metadata,
      },
    });
  }

  updateTenant(id: string, input: UpdateTenantInput): Promise<Tenant> {
    return this.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.primaryEmail !== undefined ? { primaryEmail: input.primaryEmail } : {}),
        ...(input.primaryPhone !== undefined ? { primaryPhone: input.primaryPhone } : {}),
        ...(input.timezone !== undefined ? { timezone: input.timezone } : {}),
        ...(input.currencyCode !== undefined ? { currencyCode: input.currencyCode } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
      },
    });
  }

  softDeleteTenant(id: string): Promise<Prisma.BatchPayload> {
    return this.softDelete({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async assignSubscription(input: AssignSubscriptionInput): Promise<Subscription> {
    return this.transaction(async (tx) => {
      await tx.subscription.updateMany({
        where: {
          tenantId: input.tenantId,
          status: SubscriptionStatus.ACTIVE,
          deletedAt: null,
        },
        data: {
          status: SubscriptionStatus.CANCELED,
          endsAt: new Date(),
        },
      });

      return tx.subscription.create({
        data: {
          tenantId: input.tenantId,
          plan: input.plan,
          status: input.status,
          startsAt: input.startsAt,
          endsAt: input.endsAt,
          trialEndsAt: input.trialEndsAt,
          seats: input.seats,
          priceMinor: input.priceMinor,
          currencyCode: input.currencyCode,
          metadata: input.metadata,
        },
      });
    });
  }
}
