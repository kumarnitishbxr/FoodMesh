import { ConflictException, NotFoundException } from '@nestjs/common';
import { SubscriptionPlan, SubscriptionStatus, TenantStatus } from '@prisma/client';
import { TenantService } from '../application/tenant.service';
import { TenantPrismaRepository } from '../infrastructure/repositories/tenant-prisma.repository';

describe('TenantService', () => {
  const repository = {
    findTenantBySlug: jest.fn(),
    createTenant: jest.fn(),
    findTenantDetailsById: jest.fn(),
    findTenantById: jest.fn(),
    updateTenant: jest.fn(),
    softDeleteTenant: jest.fn(),
    assignSubscription: jest.fn(),
  } as unknown as jest.Mocked<TenantPrismaRepository>;

  let service: TenantService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TenantService(repository);
  });

  it('creates a tenant when slug is unique', async () => {
    repository.findTenantBySlug.mockResolvedValue(null);
    repository.createTenant.mockResolvedValue({
      id: 'tenant-1',
      name: 'Demo',
      slug: 'demo',
      status: TenantStatus.ACTIVE,
      primaryEmail: 'owner@demo.com',
      primaryPhone: null,
      timezone: 'Asia/Kolkata',
      currencyCode: 'INR',
      metadata: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    } as never);

    const result = await service.createTenant(
      {
        name: 'Demo',
        slug: 'demo',
        primaryEmail: 'owner@demo.com',
        timezone: 'Asia/Kolkata',
        currencyCode: 'INR',
      },
      {
        sub: 'user-1',
        tenantId: 'tenant-1',
        email: 'admin@foodmesh.dev',
        role: 'SUPER_ADMIN' as never,
        tokenType: 'access',
      },
    );

    expect(repository.createTenant).toHaveBeenCalled();
    expect(result.slug).toBe('demo');
  });

  it('rejects duplicate tenant slugs', async () => {
    repository.findTenantBySlug.mockResolvedValue({ id: 'tenant-1' } as never);

    await expect(
      service.createTenant(
        {
          name: 'Demo',
          slug: 'demo',
          primaryEmail: 'owner@demo.com',
          timezone: 'Asia/Kolkata',
          currencyCode: 'INR',
        },
        {
          sub: 'user-1',
          tenantId: 'tenant-1',
          email: 'admin@foodmesh.dev',
          role: 'SUPER_ADMIN' as never,
          tokenType: 'access',
        },
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('updates an existing tenant', async () => {
    repository.findTenantById.mockResolvedValue({ id: 'tenant-1' } as never);
    repository.updateTenant.mockResolvedValue({} as never);
    repository.findTenantDetailsById.mockResolvedValue({
      id: 'tenant-1',
      name: 'Updated',
      slug: 'demo',
      status: TenantStatus.ACTIVE,
      primaryEmail: 'owner@demo.com',
      primaryPhone: null,
      timezone: 'UTC',
      currencyCode: 'USD',
      metadata: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      subscriptions: [],
    } as never);

    const result = await service.updateTenant('tenant-1', { name: 'Updated' });

    expect(repository.updateTenant).toHaveBeenCalled();
    expect(result.name).toBe('Updated');
  });

  it('throws when tenant is missing during deletion', async () => {
    repository.findTenantById.mockResolvedValue(null);

    await expect(service.deleteTenant('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('assigns a subscription', async () => {
    repository.findTenantById.mockResolvedValue({ id: 'tenant-1' } as never);
    repository.assignSubscription.mockResolvedValue({} as never);
    repository.findTenantDetailsById.mockResolvedValue({
      id: 'tenant-1',
      name: 'Demo',
      slug: 'demo',
      status: TenantStatus.ACTIVE,
      primaryEmail: 'owner@demo.com',
      primaryPhone: null,
      timezone: 'Asia/Kolkata',
      currencyCode: 'INR',
      metadata: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      subscriptions: [
        {
          id: 'sub-1',
          tenantId: 'tenant-1',
          plan: SubscriptionPlan.GROWTH,
          status: SubscriptionStatus.ACTIVE,
          startsAt: new Date('2026-01-01T00:00:00.000Z'),
          endsAt: null,
          trialEndsAt: null,
          seats: 10,
          priceMinor: 499900,
          currencyCode: 'INR',
          metadata: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ],
    } as never);

    const result = await service.assignSubscription('tenant-1', {
      plan: SubscriptionPlan.GROWTH,
      status: SubscriptionStatus.ACTIVE,
      startsAt: '2026-01-01T00:00:00.000Z',
      seats: 10,
      priceMinor: 499900,
      currencyCode: 'INR',
    });

    expect(repository.assignSubscription).toHaveBeenCalled();
    expect(result.activeSubscription?.plan).toBe(SubscriptionPlan.GROWTH);
  });
});
