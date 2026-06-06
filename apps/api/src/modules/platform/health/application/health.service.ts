import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/persistence/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<{
    status: 'ok' | 'degraded';
    service: string;
    checks: {
      database: 'up' | 'down';
    };
  }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        service: 'foodmesh-api',
        checks: {
          database: 'up',
        },
      };
    } catch {
      return {
        status: 'degraded',
        service: 'foodmesh-api',
        checks: {
          database: 'down',
        },
      };
    }
  }
}
