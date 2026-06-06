# FoodMesh Prisma Schema Notes

## 1. ER Diagram Explanation

### Tenant Core

- `Tenant` is the root multi-tenant boundary.
- Every tenant-owned entity includes `tenantId`.
- All operational queries should scope by `tenantId` first.

### Identity and Access

- `User` belongs to one `Tenant`.
- A `User` can optionally be scoped to a `Restaurant` and an `Outlet`.
- `RefreshToken` belongs to one `User` and one `Tenant`.
- `AuditLog` records tenant-scoped actor activity and references the acting `User` when available.

### Commercial and Organization Structure

- `Subscription` belongs to one `Tenant`.
- `Restaurant` belongs to one `Tenant`.
- `Outlet` belongs to one `Restaurant` and one `Tenant`.

This gives the hierarchy:

- `Tenant`
- `Restaurant`
- `Outlet`

### Catalog Structure

- `Category` belongs to one `Restaurant` and one `Tenant`.
- `MenuItem` belongs to one `Category`, one `Restaurant`, and one `Tenant`.
- `Variant` belongs to one `MenuItem` and one `Tenant`.
- `Addon` belongs to one `MenuItem` and one `Tenant`.

This gives the catalog hierarchy:

- `Restaurant`
- `Category`
- `MenuItem`
- `Variant`
- `Addon`

### Inventory Structure

- `Inventory` belongs to one `Outlet` and one `MenuItem`.
- `Inventory` can optionally point to one `Variant`.

This supports:

- outlet-level stock tracking
- item-level or variant-level stock control
- multi-outlet inventory separation within the same tenant

### Customer and Ordering

- `Customer` belongs to one `Tenant`.
- `Order` belongs to one `Tenant` and one `Outlet`.
- `Order` can optionally belong to one `Customer`.
- `Order` can optionally reference the creating `User`.
- `OrderItem` belongs to one `Order`, one `MenuItem`, and optionally one `Variant`.
- `Payment` belongs to one `Order`.

This gives the order flow:

- `Customer`
- `Order`
- `OrderItem`
- `Payment`

### Notification and Audit

- `Notification` belongs to one `Tenant`.
- `Notification` can target a `User`, a `Customer`, and or an `Order`.
- `AuditLog` belongs to one `Tenant` and optionally one `User`.

### Soft Delete Strategy

Soft delete is implemented with `deletedAt` on all mutable business entities. This preserves history, supports auditability, and prevents accidental hard deletion in operational workflows.

### Indexing Strategy

The schema indexes:

- tenant-scoped lookups
- common relation filters
- status fields used in dashboards and queues
- time-based access patterns such as `placedAt`
- nullable soft-delete filters with `deletedAt`

## 2. Migration Commands

Run these from the repository root after the API package is scaffolded with Prisma dependencies.

### Create the first migration

```bash
pnpm --dir apps/api prisma migrate dev --name init_foodmesh_schema
```

### Generate Prisma client

```bash
pnpm --dir apps/api prisma generate
```

### Apply migrations in non-development environments

```bash
pnpm --dir apps/api prisma migrate deploy
```

### Open Prisma Studio

```bash
pnpm --dir apps/api prisma studio
```

## 3. Seed Data

The seed script is located at:

- [apps/api/prisma/seed.ts](/Users/nitishkumar/Desktop/Saas/FoodMesh/apps/api/prisma/seed.ts)

It creates:

- 1 tenant
- 1 active subscription
- 1 restaurant
- 1 outlet
- 1 tenant admin user
- 1 category
- 1 menu item
- 1 variant
- 1 addon
- 1 inventory record
- 1 customer
- 1 completed order
- 1 order item
- 1 payment
- 1 notification
- 1 audit log entry
- 1 refresh token

### Run the seed

```bash
pnpm --dir apps/api tsx prisma/seed.ts
```

If Prisma seed integration is configured in `apps/api/package.json`, you can also use:

```bash
pnpm --dir apps/api prisma db seed
```
