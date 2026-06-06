import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';
import { AuthenticatedUser } from '../../identity/application/interfaces/authenticated-user.interface';
import { AssignSubscriptionDto } from '../presentation/http/dto/assign-subscription.dto';
import { CreateTenantDto } from '../presentation/http/dto/create-tenant.dto';
import { TenantDetailDto } from '../presentation/http/dto/tenant-detail.dto';
import { UpdateTenantDto } from '../presentation/http/dto/update-tenant.dto';
import {
  AssignSubscriptionInput,
  TenantWithSubscriptions,
  UpdateTenantInput,
} from './tenant.types';
import { TenantPrismaRepository } from '../infrastructure/repositories/tenant-prisma.repository';

@Injectable()
export class TenantService {
  constructor(private readonly repository: TenantPrismaRepository) {}

  async createTenant(
    dto: CreateTenantDto,
    _actor: AuthenticatedUser,
  ): Promise<TenantDetailDto> {
    const existingBySlug = await this.repository.findTenantBySlug(dto.slug);

    if (existingBySlug) {
      throw new ConflictException('A tenant with this slug already exists.');
    }

    const tenant = await this.repository.createTenant({
      name: dto.name,
      slug: dto.slug,
      primaryEmail: dto.primaryEmail.toLowerCase(),
      primaryPhone: dto.primaryPhone,
      timezone: dto.timezone,
      currencyCode: dto.currencyCode.toUpperCase(),
      metadata: dto.metadata ?? null,
    });

    return this.toTenantDetail({
      ...tenant,
      subscriptions: [],
    });
  }

  async getTenantDetails(tenantId: string): Promise<TenantDetailDto> {
    const tenant = await this.repository.findTenantDetailsById(tenantId);

    if (!tenant) {
      throw new NotFoundException('Tenant not found.');
    }

    return this.toTenantDetail(tenant);
  }

  async updateTenant(
    tenantId: string,
    dto: UpdateTenantDto,
  ): Promise<TenantDetailDto> {
    const existingTenant = await this.repository.findTenantById(tenantId);

    if (!existingTenant) {
      throw new NotFoundException('Tenant not found.');
    }

    const updateInput: UpdateTenantInput = {
      name: dto.name,
      primaryEmail: dto.primaryEmail?.toLowerCase(),
      primaryPhone: dto.primaryPhone,
      timezone: dto.timezone,
      currencyCode: dto.currencyCode?.toUpperCase(),
      status: dto.status,
      metadata: dto.metadata,
    };

    await this.repository.updateTenant(tenantId, updateInput);
    const updatedTenant = await this.repository.findTenantDetailsById(tenantId);

    if (!updatedTenant) {
      throw new NotFoundException('Tenant not found after update.');
    }

    return this.toTenantDetail(updatedTenant);
  }

  async deleteTenant(tenantId: string): Promise<{ message: string }> {
    const existingTenant = await this.repository.findTenantById(tenantId);

    if (!existingTenant) {
      throw new NotFoundException('Tenant not found.');
    }

    await this.repository.softDeleteTenant(tenantId);

    return { message: 'Tenant deleted successfully.' };
  }

  async assignSubscription(
    tenantId: string,
    dto: AssignSubscriptionDto,
  ): Promise<TenantDetailDto> {
    const tenant = await this.repository.findTenantById(tenantId);

    if (!tenant) {
      throw new NotFoundException('Tenant not found.');
    }

    const input: AssignSubscriptionInput = {
      tenantId,
      plan: dto.plan,
      status: dto.status,
      startsAt: new Date(dto.startsAt),
      endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
      trialEndsAt: dto.trialEndsAt ? new Date(dto.trialEndsAt) : null,
      seats: dto.seats,
      priceMinor: dto.priceMinor,
      currencyCode: dto.currencyCode.toUpperCase(),
      metadata: dto.metadata ?? null,
    };

    await this.repository.assignSubscription(input);

    const tenantDetails = await this.repository.findTenantDetailsById(tenantId);

    if (!tenantDetails) {
      throw new NotFoundException('Tenant not found after subscription assignment.');
    }

    return this.toTenantDetail(tenantDetails);
  }

  private toTenantDetail(tenant: TenantWithSubscriptions): TenantDetailDto {
    const activeSubscription =
      tenant.subscriptions.find((item) => item.status === SubscriptionStatus.ACTIVE) ??
      tenant.subscriptions[0] ??
      null;

    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      status: tenant.status,
      primaryEmail: tenant.primaryEmail,
      primaryPhone: tenant.primaryPhone,
      timezone: tenant.timezone,
      currencyCode: tenant.currencyCode,
      metadata: (tenant.metadata as Record<string, unknown> | null | undefined) ?? null,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
      deletedAt: tenant.deletedAt,
      activeSubscription: activeSubscription
        ? {
            id: activeSubscription.id,
            tenantId: activeSubscription.tenantId,
            plan: activeSubscription.plan,
            status: activeSubscription.status,
            startsAt: activeSubscription.startsAt,
            endsAt: activeSubscription.endsAt,
            trialEndsAt: activeSubscription.trialEndsAt,
            seats: activeSubscription.seats,
            priceMinor: activeSubscription.priceMinor,
            currencyCode: activeSubscription.currencyCode,
            metadata:
              (activeSubscription.metadata as Record<string, unknown> | null | undefined) ??
              null,
            createdAt: activeSubscription.createdAt,
            updatedAt: activeSubscription.updatedAt,
          }
        : null,
      subscriptions: tenant.subscriptions.map((subscription) => ({
        id: subscription.id,
        tenantId: subscription.tenantId,
        plan: subscription.plan,
        status: subscription.status,
        startsAt: subscription.startsAt,
        endsAt: subscription.endsAt,
        trialEndsAt: subscription.trialEndsAt,
        seats: subscription.seats,
        priceMinor: subscription.priceMinor,
        currencyCode: subscription.currencyCode,
        metadata:
          (subscription.metadata as Record<string, unknown> | null | undefined) ?? null,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
      })),
    };
  }
}
