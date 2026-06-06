import { Injectable } from '@nestjs/common';
import { Prisma, RefreshToken, User, UserRole, UserStatus } from '@prisma/client';
import { BaseRepository } from '../../../../common/repositories/base.repository';
import { PrismaService } from '../../../../common/persistence/prisma.service';

type CreateUserInput = {
  tenantId: string;
  restaurantId?: string | null;
  outletId?: string | null;
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  emailVerificationTokenHash?: string | null;
  emailVerificationExpiresAt?: Date | null;
};

type CreateRefreshTokenInput = {
  tenantId: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

@Injectable()
export class AuthPrismaRepository extends BaseRepository<
  User,
  Prisma.UserFindManyArgs,
  Prisma.UserFindUniqueArgs,
  Prisma.UserCreateArgs,
  Prisma.UserUpdateArgs,
  Prisma.UserUpdateManyArgs
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.user);
  }

  findUserByEmail(tenantId: string, email: string): Promise<User | null> {
    return this.findFirst({
      where: {
        tenantId,
        email: email.toLowerCase(),
        deletedAt: null,
      },
    });
  }

  findUserById(id: string, tenantId: string): Promise<User | null> {
    return this.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
    });
  }

  findUserByPasswordResetHash(passwordResetTokenHash: string): Promise<User | null> {
    return this.findFirst({
      where: {
        passwordResetTokenHash,
        deletedAt: null,
      },
    });
  }

  findUserByEmailVerificationHash(
    emailVerificationTokenHash: string,
  ): Promise<User | null> {
    return this.findFirst({
      where: {
        emailVerificationTokenHash,
        deletedAt: null,
      },
    });
  }

  createUser(input: CreateUserInput): Promise<User> {
    return this.create({
      data: {
        tenantId: input.tenantId,
        restaurantId: input.restaurantId,
        outletId: input.outletId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        passwordHash: input.passwordHash,
        role: input.role,
        status: input.status,
        isEmailVerified: input.isEmailVerified,
        emailVerificationTokenHash: input.emailVerificationTokenHash,
        emailVerificationExpiresAt: input.emailVerificationExpiresAt,
      },
    });
  }

  updateLastLogin(userId: string, lastLoginAt: Date): Promise<User> {
    return this.update({
      where: { id: userId },
      data: { lastLoginAt },
    });
  }

  storePasswordResetToken(
    userId: string,
    passwordResetTokenHash: string,
    passwordResetExpiresAt: Date,
  ): Promise<User> {
    return this.update({
      where: { id: userId },
      data: {
        passwordResetTokenHash,
        passwordResetExpiresAt,
      },
    });
  }

  markEmailVerified(userId: string): Promise<User> {
    return this.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationTokenHash: null,
        emailVerificationExpiresAt: null,
      },
    });
  }

  resetPassword(userId: string, passwordHash: string): Promise<User> {
    return this.update({
      where: { id: userId },
      data: {
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });
  }

  storeRefreshToken(input: CreateRefreshTokenInput): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data: {
        tenantId: input.tenantId,
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
      },
    });
  }

  findActiveRefreshToken(
    tokenHash: string,
    userId: string,
    tenantId: string,
  ): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        userId,
        tenantId,
        revokedAt: null,
        deletedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  revokeRefreshToken(
    tokenHash: string,
    userId: string,
    tenantId: string,
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        userId,
        tenantId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  revokeAllRefreshTokensForUser(
    userId: string,
    tenantId: string,
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.refreshToken.updateMany({
      where: {
        userId,
        tenantId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
