import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole, UserStatus } from '@prisma/client';
import { AuthService } from '../application/auth.service';
import { AuthPrismaRepository } from '../infrastructure/repositories/auth-prisma.repository';

describe('AuthService', () => {
  const repository = {
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
    storeRefreshToken: jest.fn(),
    updateLastLogin: jest.fn(),
    findActiveRefreshToken: jest.fn(),
    findUserById: jest.fn(),
    revokeRefreshToken: jest.fn(),
    storePasswordResetToken: jest.fn(),
    findUserByPasswordResetHash: jest.fn(),
    resetPassword: jest.fn(),
    revokeAllRefreshTokensForUser: jest.fn(),
    findUserByEmailVerificationHash: jest.fn(),
    markEmailVerified: jest.fn(),
  } as unknown as jest.Mocked<AuthPrismaRepository>;

  const jwtService = {
    signAsync: jest.fn(),
  } as unknown as jest.Mocked<JwtService>;

  const configService = {
    get: jest.fn((key: string) => {
      const values: Record<string, string> = {
        JWT_ACCESS_TOKEN_TTL: '15m',
        JWT_REFRESH_TOKEN_TTL: '7d',
        JWT_ACCESS_TOKEN_SECRET: 'access-secret',
        JWT_REFRESH_TOKEN_SECRET: 'refresh-secret',
        JWT_REFRESH_TOKEN_TTL_DAYS: '7',
      };

      return values[key];
    }),
  } as unknown as jest.Mocked<ConfigService>;

  const baseUser = {
    id: 'user-1',
    tenantId: 'tenant-1',
    restaurantId: null,
    outletId: null,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@foodmesh.dev',
    phone: null,
    passwordHash: '$2b$12$6xLi6DF32Rkf8M6vSjKQj.R7w.3WnC6fYo3vbpYBf15A4d6YxH8zC',
    role: UserRole.STAFF,
    status: UserStatus.ACTIVE,
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
    passwordResetTokenHash: null,
    passwordResetExpiresAt: null,
    emailVerificationTokenHash: null,
    emailVerificationExpiresAt: null,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    jwtService.signAsync.mockResolvedValueOnce('access-token').mockResolvedValueOnce(
      'refresh-token',
    );
    service = new AuthService(repository, jwtService, configService);
  });

  it('registers a new user and issues tokens', async () => {
    repository.findUserByEmail.mockResolvedValue(null);
    repository.createUser.mockResolvedValue(baseUser as never);
    repository.storeRefreshToken.mockResolvedValue({} as never);

    const result = await service.register({
      tenantId: 'tenant-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@foodmesh.dev',
      password: 'Password1',
      role: UserRole.STAFF,
    });

    expect(repository.createUser).toHaveBeenCalled();
    expect(result.tokens.accessToken).toBe('access-token');
    expect(result.user.email).toBe(baseUser.email);
  });

  it('rejects duplicate registration', async () => {
    repository.findUserByEmail.mockResolvedValue(baseUser as never);

    await expect(
      service.register({
        tenantId: 'tenant-1',
        firstName: 'Test',
        email: 'test@foodmesh.dev',
        password: 'Password1',
        role: UserRole.STAFF,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects invalid login', async () => {
    repository.findUserByEmail.mockResolvedValue(null);

    await expect(
      service.login({
        tenantId: 'tenant-1',
        email: 'missing@foodmesh.dev',
        password: 'Password1',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('verifies email token', async () => {
    repository.findUserByEmailVerificationHash.mockResolvedValue({
      ...baseUser,
      emailVerificationTokenHash: 'hash',
      emailVerificationExpiresAt: new Date(Date.now() + 60_000),
      isEmailVerified: false,
    } as never);
    repository.markEmailVerified.mockResolvedValue(baseUser as never);

    const result = await service.verifyEmail({ token: 'plain-token' });

    expect(repository.markEmailVerified).toHaveBeenCalled();
    expect(result.message).toBe('Email verified successfully.');
  });
});
