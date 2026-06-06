import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from '../infrastructure/http/strategies/jwt.strategy';

describe('JwtStrategy', () => {
  it('returns payload when token type is access', () => {
    const strategy = new JwtStrategy({
      get: jest.fn().mockReturnValue('access-secret'),
    } as unknown as ConfigService);

    const result = strategy.validate({
      sub: 'user-1',
      tenantId: 'tenant-1',
      email: 'test@foodmesh.dev',
      role: 'STAFF' as never,
      tokenType: 'access',
    });

    expect(result.sub).toBe('user-1');
  });

  it('rejects non-access tokens', () => {
    const strategy = new JwtStrategy({
      get: jest.fn().mockReturnValue('access-secret'),
    } as unknown as ConfigService);

    expect(() =>
      strategy.validate({
        sub: 'user-1',
        tenantId: 'tenant-1',
        email: 'test@foodmesh.dev',
        role: 'STAFF' as never,
        tokenType: 'refresh',
      }),
    ).toThrow(UnauthorizedException);
  });
});
