# FoodMesh Monorepo Structure

## Scope

This document defines the complete FoodMesh monorepo structure for the current stack:

- Frontend: React, TypeScript, Vite
- Backend: NestJS, TypeScript
- Database: PostgreSQL, Prisma

The structure is designed for a domain-oriented modular monolith first, with clean extraction paths for integration-heavy and high-throughput modules later.

## 1. Complete Folder Tree

```text
FoodMesh/
  .github/
    workflows/
      ci.yml
      cd.yml
      lint.yml
      test.yml
  .husky/
    pre-commit
    commit-msg
  docs/
    architecture.md
    monorepo-structure.md
    adr/
    api/
    diagrams/
    runbooks/
  apps/
    admin-web/
      public/
      src/
        app/
          router/
          providers/
          layouts/
          guards/
        pages/
        features/
          auth/
          tenants/
          brands/
          locations/
          catalog/
          menu/
          inventory/
          orders/
          fulfillment/
          integrations/
          analytics/
          billing/
          settings/
        components/
          ui/
          data-display/
          forms/
          feedback/
        hooks/
        lib/
        services/
        stores/
        styles/
        assets/
        types/
        test/
          setup/
          fixtures/
          utils/
      index.html
      vite.config.ts
      tsconfig.json
      package.json
    ops-console/
      public/
      src/
        app/
          router/
          providers/
          layouts/
        pages/
        features/
          kitchen/
          live-orders/
          dispatch/
          inventory-ops/
          menu-ops/
          alerts/
        components/
        hooks/
        lib/
        services/
        stores/
        styles/
        assets/
        types/
        test/
      index.html
      vite.config.ts
      tsconfig.json
      package.json
    api/
      src/
        main.ts
        app.module.ts
        bootstrap/
          config/
          pipes/
          filters/
          interceptors/
          guards/
          decorators/
        modules/
          identity/
            application/
            domain/
              entities/
              value-objects/
              services/
              events/
            infrastructure/
              persistence/
                prisma/
                repositories/
              http/
              messaging/
            presentation/
              http/
                controllers/
                dto/
              graphql/
            identity.module.ts
          tenants/
            application/
            domain/
            infrastructure/
              persistence/
              repositories/
            presentation/
              http/
            tenants.module.ts
          brands/
            application/
            domain/
            infrastructure/
            presentation/
            brands.module.ts
          locations/
            application/
            domain/
            infrastructure/
            presentation/
            locations.module.ts
          catalog/
            application/
            domain/
            infrastructure/
            presentation/
            catalog.module.ts
          menu/
            application/
            domain/
            infrastructure/
            presentation/
            menu.module.ts
          inventory/
            application/
            domain/
            infrastructure/
            presentation/
            inventory.module.ts
          orders/
            application/
            domain/
            infrastructure/
            presentation/
            orders.module.ts
          fulfillment/
            application/
            domain/
            infrastructure/
            presentation/
            fulfillment.module.ts
          integrations/
            application/
            domain/
            infrastructure/
              connectors/
                pos/
                marketplaces/
                delivery/
              persistence/
              webhooks/
            presentation/
            integrations.module.ts
          analytics/
            application/
            domain/
            infrastructure/
            presentation/
            analytics.module.ts
          billing/
            application/
            domain/
            infrastructure/
            presentation/
            billing.module.ts
          notifications/
            application/
            domain/
            infrastructure/
            presentation/
            notifications.module.ts
          ai/
            application/
            domain/
            infrastructure/
            presentation/
            ai.module.ts
          platform/
            health/
            audit/
            idempotency/
            outbox/
            jobs/
            cache/
            tenancy/
            authz/
        common/
          constants/
          enums/
          exceptions/
          interfaces/
          utils/
        test/
          unit/
          integration/
          e2e/
          fixtures/
      prisma/
        schema/
          base.prisma
          identity.prisma
          tenants.prisma
          brands.prisma
          locations.prisma
          catalog.prisma
          menu.prisma
          inventory.prisma
          orders.prisma
          fulfillment.prisma
          integrations.prisma
          analytics.prisma
          billing.prisma
          notifications.prisma
          ai.prisma
        migrations/
        seeds/
        prisma.config.ts
      nest-cli.json
      tsconfig.json
      package.json
    worker/
      src/
        main.ts
        worker.module.ts
        bootstrap/
        processors/
          outbox/
          webhooks/
          sync-jobs/
          notifications/
          analytics/
          ai/
        jobs/
        queues/
        schedulers/
        common/
        test/
      tsconfig.json
      package.json
  packages/
    config/
      eslint/
      prettier/
      typescript/
      vite/
      jest/
      nest/
      package.json
    contracts/
      src/
        api/
          identity/
          tenants/
          brands/
          locations/
          catalog/
          menu/
          inventory/
          orders/
          fulfillment/
          integrations/
          analytics/
          billing/
          notifications/
          ai/
        events/
        errors/
        pagination/
        index.ts
      package.json
    database/
      src/
        client/
        extensions/
        repositories/
        transactions/
        tenancy/
        testing/
        index.ts
      prisma/
        generators/
      package.json
    auth/
      src/
        guards/
        policies/
        permissions/
        decorators/
        tokens/
        index.ts
      package.json
    tenancy/
      src/
        context/
        resolvers/
        guards/
        headers/
        testing/
        index.ts
      package.json
    events/
      src/
        domain/
        integration/
        outbox/
        serialization/
        index.ts
      package.json
    observability/
      src/
        logging/
        tracing/
        metrics/
        health/
        index.ts
      package.json
    ui/
      src/
        components/
        tokens/
        icons/
        hooks/
        utils/
        index.ts
      package.json
    types/
      src/
        identity/
        tenants/
        catalog/
        inventory/
        orders/
        analytics/
        shared/
        index.ts
      package.json
    utils/
      src/
        dates/
        money/
        strings/
        objects/
        async/
        index.ts
      package.json
    testing/
      src/
        fixtures/
        factories/
        mocks/
        integration/
        e2e/
        index.ts
      package.json
  infra/
    docker/
      postgres/
      redis/
    terraform/
      environments/
        dev/
        staging/
        production/
      modules/
        network/
        compute/
        database/
        cache/
        secrets/
        observability/
    kubernetes/
      base/
      overlays/
        dev/
        staging/
        production/
    scripts/
      setup/
      deploy/
      migrate/
      seed/
  tools/
    generators/
    lint-rules/
    codemods/
    scripts/
  env/
    examples/
      .env.root.example
      .env.admin-web.example
      .env.ops-console.example
      .env.api.example
      .env.worker.example
    schemas/
      root.env.schema.ts
      admin-web.env.schema.ts
      ops-console.env.schema.ts
      api.env.schema.ts
      worker.env.schema.ts
  package.json
  pnpm-workspace.yaml
  turbo.json
  tsconfig.base.json
  .editorconfig
  .gitignore
  .npmrc
  README.md
```

## 2. Naming Conventions

### Repository and Workspace

- Use `kebab-case` for app, package, and folder names.
- Use singular names for technical packages only when the package represents a capability, such as `auth` or `database`.
- Use plural names for business domains that model bounded contexts, such as `orders`, `locations`, and `integrations`.

### Frontend

- React components: `PascalCase`
- hooks: `useCamelCase`
- files for components: `PascalCase.tsx`
- utility files: `camelCase.ts`
- feature folders: `kebab-case`
- route segments: `kebab-case`

Examples:

- `OrderDetailsPage.tsx`
- `useLiveOrders.ts`
- `features/live-orders/`
- `components/ui/Button.tsx`

### Backend

- Nest modules: `*.module.ts`
- controllers: `*.controller.ts`
- services: `*.service.ts`
- policies: `*.policy.ts`
- DTOs: `*.dto.ts`
- entities and value objects: `PascalCase`
- domain events: `PascalCase` ending with `Event`
- Prisma repository adapters: `*.repository.ts`

Examples:

- `orders.module.ts`
- `orders.controller.ts`
- `create-order.dto.ts`
- `OrderAggregate.ts`
- `OrderCreatedEvent.ts`

### Database and Prisma

- Prisma models: `PascalCase`
- database tables: `snake_case`
- columns: `snake_case`
- enum values in database: `UPPER_SNAKE_CASE`
- Prisma enum names: `PascalCase`
- migration folders: timestamp prefix plus concise action

Examples:

- Prisma model: `OrderItem`
- table: `order_items`
- column: `tenant_id`
- migration: `20260606123000_create_orders`

### Environment Variables

- Use `UPPER_SNAKE_CASE`
- Prefix frontend public variables with `VITE_`
- Prefix app-specific backend variables only when collision is likely
- Never expose secrets through Vite environment names

Examples:

- `NODE_ENV`
- `DATABASE_URL`
- `REDIS_URL`
- `VITE_API_BASE_URL`
- `JWT_ACCESS_TOKEN_TTL`

## 3. Module Conventions

### Backend Module Layout

Each NestJS domain module follows the same internal structure:

```text
module-name/
  application/
  domain/
  infrastructure/
  presentation/
  module-name.module.ts
```

### Layer Responsibilities

- `application/`
  - use cases
  - command handlers
  - query handlers
  - mappers
  - orchestrators
- `domain/`
  - aggregates
  - entities
  - value objects
  - domain services
  - domain events
  - business invariants
- `infrastructure/`
  - Prisma adapters
  - repository implementations
  - external provider clients
  - cache adapters
  - queue publishers
- `presentation/`
  - REST controllers
  - request and response DTOs
  - transport-specific serializers

### Dependency Rules

- `presentation` depends on `application`
- `application` depends on `domain`
- `infrastructure` depends on `application` and `domain`
- `domain` depends on nothing outside itself or small shared abstractions
- modules must not import each other’s infrastructure directly
- cross-module coordination happens through application interfaces, domain events, or shared contracts

### Frontend Feature Conventions

Each frontend feature should follow this structure:

```text
features/
  feature-name/
    api/
    components/
    hooks/
    routes/
    store/
    types/
    utils/
```

Rules:

- Feature folders own their screens, state, and transport hooks.
- Shared visual primitives belong in `components/ui`.
- Shared API client behavior belongs in `src/services` or a shared package, not inside arbitrary features.
- Avoid a global `utils/` dumping ground inside apps; keep utilities close to the feature unless reused by multiple apps.

### Module Ownership

- `identity` owns authentication, RBAC, sessions, and actor context
- `tenants` owns tenant metadata and entitlements
- `brands` owns brand hierarchy
- `locations` owns store or kitchen locations
- `catalog` owns product definitions and modifiers
- `menu` owns sellable menu views and publication
- `inventory` owns stock, recipes, and adjustments
- `orders` owns order intake and lifecycle
- `fulfillment` owns kitchen workflow and readiness
- `integrations` owns POS, marketplaces, webhooks, and sync jobs
- `analytics` owns reporting read models and KPI aggregation
- `billing` owns plans, subscriptions, and usage
- `notifications` owns outbound messaging
- `ai` owns forecasting and recommendation orchestration

## 4. Shared Package Structure

### Package Design Principles

- Shared packages must contain reusable platform or contract code, not business logic that belongs to a domain.
- Packages should be stable, dependency-light, and safe to consume from multiple apps.
- Any package that starts to encode domain ownership should be moved back into a domain module.

### Required Shared Packages

#### `packages/config`

- Centralized lint, format, TS, test, and build presets
- No runtime business dependencies

#### `packages/contracts`

- API request and response contracts
- domain event payload contracts
- shared error shapes
- pagination and cursor primitives

#### `packages/database`

- Prisma client composition
- common query extensions
- transaction helpers
- test database helpers
- tenant-aware repository helpers

#### `packages/auth`

- shared decorators
- claims types
- permission policies
- auth guard helpers

#### `packages/tenancy`

- tenant context resolution
- tenant header utilities
- tenant test helpers
- request scoping primitives

#### `packages/events`

- event metadata
- serialization contracts
- outbox event envelopes
- topic naming helpers

#### `packages/observability`

- logger setup
- trace propagation
- metrics helpers
- health check utilities

#### `packages/ui`

- shared design tokens
- common React UI primitives
- icons
- low-level hooks only

#### `packages/types`

- cross-app TypeScript types
- non-domain-specific shared interfaces
- transport-neutral primitives

#### `packages/utils`

- money math
- date utilities
- object transforms
- async helpers

#### `packages/testing`

- test factories
- mocks
- integration harnesses
- e2e helpers

### Shared Package Rules

- No package should import from an app.
- `packages/ui` must not depend on backend packages.
- `packages/database` must not contain domain logic.
- `packages/contracts` is the canonical transport contract package.
- Shared packages should expose stable public entry points through `index.ts`.

## 5. Environment Structure

### Environment File Layout

```text
env/
  examples/
    .env.root.example
    .env.admin-web.example
    .env.ops-console.example
    .env.api.example
    .env.worker.example
  schemas/
    root.env.schema.ts
    admin-web.env.schema.ts
    ops-console.env.schema.ts
    api.env.schema.ts
    worker.env.schema.ts
```

### Runtime Environment Ownership

#### Root Environment

Used for workspace-wide tooling.

Examples:

- package manager configuration
- turbo cache configuration
- shared CI metadata

#### `admin-web`

Used for public frontend configuration only.

Examples:

- `VITE_API_BASE_URL`
- `VITE_APP_ENV`
- `VITE_SENTRY_DSN`

#### `ops-console`

Used for operations frontend configuration only.

Examples:

- `VITE_API_BASE_URL`
- `VITE_APP_ENV`
- `VITE_REALTIME_BASE_URL`

#### `api`

Used for NestJS HTTP runtime.

Examples:

- `PORT`
- `DATABASE_URL`
- `DIRECT_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `S3_BUCKET`
- `WEBHOOK_SIGNING_SECRET`

#### `worker`

Used for async processing and schedulers.

Examples:

- `DATABASE_URL`
- `REDIS_URL`
- `QUEUE_CONCURRENCY`
- `WEBHOOK_RETRY_LIMIT`
- `ANALYTICS_EXPORT_BATCH_SIZE`

### Environment Validation Rules

- Every app and service must validate its environment at startup.
- Environment schemas should live in `env/schemas/` and be consumed by the owning runtime.
- Missing required environment variables should fail fast during boot.
- Optional variables must have explicit defaults or documented behavior.

### Secret Handling Rules

- Commit only `*.example` files.
- Never commit real `.env` files.
- Store production secrets in a secret manager, not in the repository.
- Frontend apps may only read `VITE_` variables intended for public exposure.
- Rotate integration credentials independently from application deploys.

## Monorepo Operating Rules

- Use `pnpm` workspaces for package management.
- Use `turbo` for task orchestration and caching.
- Keep apps deployable independently even while developed in a single monorepo.
- Start as a modular monolith with `apps/api` and `apps/worker`, not multiple premature microservices.
- Treat `domains/` at the conceptual level as module boundaries even when physically implemented under `apps/api/src/modules`.

## Recommended Next Scaffolding Order

1. Root workspace files: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`
2. Frontend apps: `apps/admin-web`, `apps/ops-console`
3. Backend runtimes: `apps/api`, `apps/worker`
4. Shared packages: `packages/config`, `packages/contracts`, `packages/database`, `packages/auth`, `packages/tenancy`
5. Prisma schema split and migration layout
6. Environment schemas and example files

