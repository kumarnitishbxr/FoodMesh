import { SetMetadata } from '@nestjs/common';

export const SKIP_TENANT_ISOLATION_KEY = 'skipTenantIsolation';
export const SkipTenantIsolation = () => SetMetadata(SKIP_TENANT_ISOLATION_KEY, true);
