import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenantId = '11111111-1111-1111-1111-111111111111';
  const subscriptionId = '11111111-1111-1111-1111-111111111112';
  const restaurantId = '11111111-1111-1111-1111-111111111113';
  const outletId = '11111111-1111-1111-1111-111111111114';
  const userId = '11111111-1111-1111-1111-111111111115';
  const categoryId = '11111111-1111-1111-1111-111111111116';
  const menuItemId = '11111111-1111-1111-1111-111111111117';
  const variantId = '11111111-1111-1111-1111-111111111118';
  const addonId = '11111111-1111-1111-1111-111111111119';
  const inventoryId = '11111111-1111-1111-1111-111111111120';
  const customerId = '11111111-1111-1111-1111-111111111121';
  const orderId = '11111111-1111-1111-1111-111111111122';
  const orderItemId = '11111111-1111-1111-1111-111111111123';
  const paymentId = '11111111-1111-1111-1111-111111111124';
  const notificationId = '11111111-1111-1111-1111-111111111125';
  const auditLogId = '11111111-1111-1111-1111-111111111126';
  const refreshTokenId = '11111111-1111-1111-1111-111111111127';

  await prisma.tenant.upsert({
    where: { id: tenantId },
    update: {},
    create: {
      id: tenantId,
      name: 'FoodMesh Demo Tenant',
      slug: 'foodmesh-demo',
      primaryEmail: 'owner@foodmesh-demo.com',
      primaryPhone: '+919999999999',
      timezone: 'Asia/Kolkata',
      currencyCode: 'INR',
    },
  });

  await prisma.subscription.upsert({
    where: { id: subscriptionId },
    update: {},
    create: {
      id: subscriptionId,
      tenantId,
      plan: 'GROWTH',
      status: 'ACTIVE',
      startsAt: new Date('2026-01-01T00:00:00.000Z'),
      endsAt: new Date('2027-01-01T00:00:00.000Z'),
      seats: 25,
      priceMinor: 499900,
      currencyCode: 'INR',
    },
  });

  await prisma.restaurant.upsert({
    where: {
      tenantId_slug: {
        tenantId,
        slug: 'spice-route',
      },
    },
    update: {},
    create: {
      id: restaurantId,
      tenantId,
      name: 'Spice Route',
      slug: 'spice-route',
      cuisineType: 'Indian',
      status: 'ACTIVE',
    },
  });

  await prisma.outlet.upsert({
    where: {
      tenantId_code: {
        tenantId,
        code: 'BLR-01',
      },
    },
    update: {},
    create: {
      id: outletId,
      tenantId,
      restaurantId,
      name: 'Spice Route Indiranagar',
      code: 'BLR-01',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560038',
      timezone: 'Asia/Kolkata',
      status: 'ACTIVE',
    },
  });

  await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId,
        email: 'admin@foodmesh-demo.com',
      },
    },
    update: {},
    create: {
      id: userId,
      tenantId,
      restaurantId,
      outletId,
      firstName: 'Tenant',
      lastName: 'Admin',
      email: 'admin@foodmesh-demo.com',
      phone: '+919888888888',
      passwordHash: 'replace-with-bcrypt-hash',
      role: 'TENANT_ADMIN',
      status: 'ACTIVE',
    },
  });

  await prisma.category.upsert({
    where: {
      tenantId_restaurantId_slug: {
        tenantId,
        restaurantId,
        slug: 'biryani',
      },
    },
    update: {},
    create: {
      id: categoryId,
      tenantId,
      restaurantId,
      name: 'Biryani',
      slug: 'biryani',
      status: 'ACTIVE',
      sortOrder: 1,
    },
  });

  await prisma.menuItem.upsert({
    where: {
      tenantId_restaurantId_slug: {
        tenantId,
        restaurantId,
        slug: 'chicken-biryani',
      },
    },
    update: {},
    create: {
      id: menuItemId,
      tenantId,
      restaurantId,
      categoryId,
      name: 'Chicken Biryani',
      slug: 'chicken-biryani',
      sku: 'ITEM-CHICKEN-BIRYANI',
      basePriceMinor: 29900,
      currencyCode: 'INR',
      isFeatured: true,
      status: 'ACTIVE',
    },
  });

  await prisma.variant.upsert({
    where: {
      tenantId_menuItemId_name: {
        tenantId,
        menuItemId,
        name: 'Regular',
      },
    },
    update: {},
    create: {
      id: variantId,
      tenantId,
      menuItemId,
      name: 'Regular',
      sku: 'VAR-CHICKEN-BIRYANI-REG',
      priceMinor: 29900,
      currencyCode: 'INR',
      isDefault: true,
      status: 'ACTIVE',
    },
  });

  await prisma.addon.upsert({
    where: {
      tenantId_menuItemId_name: {
        tenantId,
        menuItemId,
        name: 'Extra Raita',
      },
    },
    update: {},
    create: {
      id: addonId,
      tenantId,
      menuItemId,
      name: 'Extra Raita',
      priceMinor: 3000,
      currencyCode: 'INR',
      maxQuantity: 2,
      status: 'ACTIVE',
    },
  });

  await prisma.inventory.upsert({
    where: {
      tenantId_outletId_menuItemId_variantId: {
        tenantId,
        outletId,
        menuItemId,
        variantId,
      },
    },
    update: {},
    create: {
      id: inventoryId,
      tenantId,
      outletId,
      menuItemId,
      variantId,
      quantity: '50.000',
      reservedQuantity: '2.000',
      unit: 'plate',
      reorderLevel: '10.000',
      status: 'IN_STOCK',
    },
  });

  await prisma.customer.upsert({
    where: {
      tenantId_phone: {
        tenantId,
        phone: '+917777777777',
      },
    },
    update: {},
    create: {
      id: customerId,
      tenantId,
      firstName: 'Aarav',
      lastName: 'Sharma',
      email: 'aarav@example.com',
      phone: '+917777777777',
      status: 'ACTIVE',
      lastOrderedAt: new Date('2026-06-06T10:00:00.000Z'),
    },
  });

  await prisma.order.upsert({
    where: {
      tenantId_orderNumber: {
        tenantId,
        orderNumber: 'ORD-1001',
      },
    },
    update: {},
    create: {
      id: orderId,
      tenantId,
      outletId,
      customerId,
      createdByUserId: userId,
      orderNumber: 'ORD-1001',
      source: 'STORE_FRONT',
      status: 'COMPLETED',
      subtotalMinor: 29900,
      taxMinor: 1500,
      discountMinor: 0,
      totalMinor: 31400,
      currencyCode: 'INR',
      placedAt: new Date('2026-06-06T10:00:00.000Z'),
      completedAt: new Date('2026-06-06T10:25:00.000Z'),
    },
  });

  await prisma.orderItem.upsert({
    where: { id: orderItemId },
    update: {},
    create: {
      id: orderItemId,
      tenantId,
      orderId,
      menuItemId,
      variantId,
      quantity: 1,
      unitPriceMinor: 29900,
      totalPriceMinor: 29900,
    },
  });

  await prisma.payment.upsert({
    where: { id: paymentId },
    update: {},
    create: {
      id: paymentId,
      tenantId,
      orderId,
      providerRef: 'pay_demo_001',
      method: 'UPI',
      status: 'CAPTURED',
      amountMinor: 31400,
      currencyCode: 'INR',
      paidAt: new Date('2026-06-06T10:02:00.000Z'),
    },
  });

  await prisma.notification.upsert({
    where: { id: notificationId },
    update: {},
    create: {
      id: notificationId,
      tenantId,
      userId,
      orderId,
      channel: 'IN_APP',
      status: 'READ',
      subject: 'Order completed',
      body: 'Order ORD-1001 has been completed successfully.',
      sentAt: new Date('2026-06-06T10:26:00.000Z'),
      readAt: new Date('2026-06-06T10:27:00.000Z'),
    },
  });

  await prisma.auditLog.upsert({
    where: { id: auditLogId },
    update: {},
    create: {
      id: auditLogId,
      tenantId,
      userId,
      entityType: 'Order',
      entityId: orderId,
      action: 'CREATE',
      ipAddress: '127.0.0.1',
      userAgent: 'seed-script',
      metadata: {
        orderNumber: 'ORD-1001',
        source: 'STORE_FRONT',
      },
    },
  });

  await prisma.refreshToken.upsert({
    where: { tokenHash: 'seed-refresh-token-hash' },
    update: {},
    create: {
      id: refreshTokenId,
      tenantId,
      userId,
      tokenHash: 'seed-refresh-token-hash',
      expiresAt: new Date('2026-07-06T00:00:00.000Z'),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
