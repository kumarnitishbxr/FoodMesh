import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './application/auth.service';
import { AccessTokenGuard } from './infrastructure/http/guards/access-token.guard';
import { RefreshTokenGuard } from './infrastructure/http/guards/refresh-token.guard';
import { JwtStrategy } from './infrastructure/http/strategies/jwt.strategy';
import { RefreshStrategy } from './infrastructure/http/strategies/refresh.strategy';
import { AuthPrismaRepository } from './infrastructure/repositories/auth-prisma.repository';
import { AuthController } from './presentation/http/controllers/auth.controller';
import { RbacModule } from './rbac.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    RbacModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthPrismaRepository,
    JwtStrategy,
    RefreshStrategy,
    AccessTokenGuard,
    RefreshTokenGuard,
  ],
  exports: [
    AuthService,
    AccessTokenGuard,
    RefreshTokenGuard,
    RbacModule,
  ],
})
export class IdentityModule {}
