import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserStatus } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { AuthTokens } from './interfaces/auth-tokens.interface';
import { AuthPrismaRepository } from '../infrastructure/repositories/auth-prisma.repository';
import { LoginDto } from '../presentation/http/dto/login.dto';
import { RegisterDto } from '../presentation/http/dto/register.dto';
import { ForgotPasswordDto } from '../presentation/http/dto/forgot-password.dto';
import { ResetPasswordDto } from '../presentation/http/dto/reset-password.dto';
import { VerifyEmailDto } from '../presentation/http/dto/verify-email.dto';
import { LogoutDto } from '../presentation/http/dto/logout.dto';
import { AuthResponseDto } from '../presentation/http/dto/auth-response.dto';
import { AuthUserDto } from '../presentation/http/dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthPrismaRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.repository.findUserByEmail(dto.tenantId, dto.email);

    if (existingUser) {
      throw new ConflictException('A user with this email already exists for the tenant.');
    }

    const passwordHash = await hash(dto.password, 12);
    const emailVerificationToken = this.generateOpaqueToken();
    const emailVerificationTokenHash = this.hashToken(emailVerificationToken);
    const emailVerificationExpiresAt = this.hoursFromNow(24);

    const user = await this.repository.createUser({
      tenantId: dto.tenantId,
      restaurantId: dto.restaurantId,
      outletId: dto.outletId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      passwordHash,
      role: dto.role,
      status: UserStatus.ACTIVE,
      isEmailVerified: false,
      emailVerificationTokenHash,
      emailVerificationExpiresAt,
    });

    const tokens = await this.issueTokens(user);

    await this.repository.storeRefreshToken({
      tenantId: user.tenantId,
      userId: user.id,
      tokenHash: this.hashToken(tokens.refreshToken),
      expiresAt: this.daysFromNow(this.getRefreshTokenTtlDays()),
    });

    return {
      user: this.mapUser(user),
      tokens,
      message:
        'Registration successful. Email verification is pending notification delivery.',
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.repository.findUserByEmail(dto.tenantId, dto.email);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User account is not active.');
    }

    const isPasswordValid = await compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const tokens = await this.issueTokens(user);

    await this.repository.updateLastLogin(user.id, new Date());
    await this.repository.storeRefreshToken({
      tenantId: user.tenantId,
      userId: user.id,
      tokenHash: this.hashToken(tokens.refreshToken),
      expiresAt: this.daysFromNow(this.getRefreshTokenTtlDays()),
    });

    return {
      user: this.mapUser(user),
      tokens,
      message: 'Login successful.',
    };
  }

  async logout(user: AuthenticatedUser, dto: LogoutDto): Promise<{ message: string }> {
    await this.repository.revokeRefreshToken(
      this.hashToken(dto.refreshToken),
      user.sub,
      user.tenantId,
    );

    return { message: 'Logout successful.' };
  }

  async refresh(user: AuthenticatedUser): Promise<AuthResponseDto> {
    if (!user.refreshToken) {
      throw new UnauthorizedException('Refresh token is required.');
    }

    const tokenHash = this.hashToken(user.refreshToken);
    const refreshTokenRecord = await this.repository.findActiveRefreshToken(
      tokenHash,
      user.sub,
      user.tenantId,
    );

    if (!refreshTokenRecord) {
      throw new UnauthorizedException('Refresh token is invalid or expired.');
    }

    const dbUser = await this.repository.findUserById(user.sub, user.tenantId);

    if (!dbUser || dbUser.deletedAt || dbUser.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User account is not active.');
    }

    const tokens = await this.issueTokens(dbUser);

    await this.repository.revokeRefreshToken(tokenHash, user.sub, user.tenantId);
    await this.repository.storeRefreshToken({
      tenantId: dbUser.tenantId,
      userId: dbUser.id,
      tokenHash: this.hashToken(tokens.refreshToken),
      expiresAt: this.daysFromNow(this.getRefreshTokenTtlDays()),
    });

    return {
      user: this.mapUser(dbUser),
      tokens,
      message: 'Refresh successful.',
    };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.repository.findUserByEmail(dto.tenantId, dto.email);

    if (user && !user.deletedAt) {
      const resetToken = this.generateOpaqueToken();

      await this.repository.storePasswordResetToken(
        user.id,
        this.hashToken(resetToken),
        this.hoursFromNow(1),
      );
    }

    return {
      message:
        'If the account exists, a password reset email will be sent by the notifications module.',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const tokenHash = this.hashToken(dto.token);
    const user = await this.repository.findUserByPasswordResetHash(tokenHash);

    if (
      !user ||
      !user.passwordResetExpiresAt ||
      user.passwordResetExpiresAt.getTime() < Date.now()
    ) {
      throw new BadRequestException('Reset token is invalid or expired.');
    }

    const passwordHash = await hash(dto.newPassword, 12);

    await this.repository.resetPassword(user.id, passwordHash);
    await this.repository.revokeAllRefreshTokensForUser(user.id, user.tenantId);

    return { message: 'Password reset successful.' };
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<{ message: string }> {
    const tokenHash = this.hashToken(dto.token);
    const user = await this.repository.findUserByEmailVerificationHash(tokenHash);

    if (
      !user ||
      !user.emailVerificationExpiresAt ||
      user.emailVerificationExpiresAt.getTime() < Date.now()
    ) {
      throw new BadRequestException('Email verification token is invalid or expired.');
    }

    await this.repository.markEmailVerified(user.id);

    return { message: 'Email verified successfully.' };
  }

  async me(user: AuthenticatedUser): Promise<AuthUserDto> {
    const dbUser = await this.repository.findUserById(user.sub, user.tenantId);

    if (!dbUser || dbUser.deletedAt) {
      throw new UnauthorizedException('User not found.');
    }

    return this.mapUser(dbUser);
  }

  private async issueTokens(user: User): Promise<AuthTokens> {
    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
      restaurantId: user.restaurantId,
      outletId: user.outletId,
    };

    const accessTokenExpiresIn =
      this.configService.get<string>('JWT_ACCESS_TOKEN_TTL') ?? '15m';
    const refreshTokenExpiresIn =
      this.configService.get<string>('JWT_REFRESH_TOKEN_TTL') ?? '7d';
    const accessTokenSecret =
      this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET') ?? 'foodmesh-access-secret';
    const refreshTokenSecret =
      this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET') ?? 'foodmesh-refresh-secret';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          ...payload,
          tokenType: 'access',
        },
        {
          secret: accessTokenSecret,
          expiresIn: accessTokenExpiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          ...payload,
          tokenType: 'refresh',
        },
        {
          secret: refreshTokenSecret,
          expiresIn: refreshTokenExpiresIn,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }

  private mapUser(user: User): AuthUserDto {
    return {
      id: user.id,
      tenantId: user.tenantId,
      restaurantId: user.restaurantId,
      outletId: user.outletId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private generateOpaqueToken(): string {
    return randomBytes(32).toString('hex');
  }

  private hoursFromNow(hours: number): Date {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  private daysFromNow(days: number): Date {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  private getRefreshTokenTtlDays(): number {
    const raw = this.configService.get<string>('JWT_REFRESH_TOKEN_TTL_DAYS') ?? '7';
    const parsed = Number(raw);

    return Number.isNaN(parsed) ? 7 : parsed;
  }
}
