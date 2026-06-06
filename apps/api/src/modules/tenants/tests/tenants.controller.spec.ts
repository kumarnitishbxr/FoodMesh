import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { TenantService } from '../application/tenant.service';
import { TenantsController } from '../presentation/http/controllers/tenants.controller';

describe('TenantsController', () => {
  const tenantService = {
    createTenant: jest.fn(),
    getTenantDetails: jest.fn(),
    updateTenant: jest.fn(),
    deleteTenant: jest.fn(),
    assignSubscription: jest.fn(),
  } as unknown as jest.Mocked<TenantService>;

  let controller: TenantsController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new TenantsController(tenantService);
  });

  it('forwards create requests', async () => {
    tenantService.createTenant.mockResolvedValue({ id: 'tenant-1' } as never);

    await controller.createTenant(
      {
        name: 'Demo',
        slug: 'demo',
        primaryEmail: 'owner@demo.com',
        timezone: 'Asia/Kolkata',
        currencyCode: 'INR',
      },
      {
        sub: 'user-1',
        tenantId: 'platform',
        email: 'admin@foodmesh.dev',
        role: 'SUPER_ADMIN' as never,
        tokenType: 'access',
      },
    );

    expect(tenantService.createTenant).toHaveBeenCalled();
  });

  it('forwards subscription assignments', async () => {
    tenantService.assignSubscription.mockResolvedValue({ id: 'tenant-1' } as never);

    await controller.assignSubscription('tenant-1', {
      plan: SubscriptionPlan.GROWTH,
      status: SubscriptionStatus.ACTIVE,
      startsAt: '2026-01-01T00:00:00.000Z',
      seats: 10,
      priceMinor: 499900,
      currencyCode: 'INR',
    });

    expect(tenantService.assignSubscription).toHaveBeenCalledWith('tenant-1', {
      plan: SubscriptionPlan.GROWTH,
      status: SubscriptionStatus.ACTIVE,
      startsAt: '2026-01-01T00:00:00.000Z',
      seats: 10,
      priceMinor: 499900,
      currencyCode: 'INR',
    });
  });
});
