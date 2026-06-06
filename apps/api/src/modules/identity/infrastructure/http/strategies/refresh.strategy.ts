import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthenticatedUser } from '../../../application/interfaces/authenticated-user.interface';

type RefreshPayload = Omit<AuthenticatedUser, 'refreshToken'>;

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_REFRESH_TOKEN_SECRET') ?? 'foodmesh-refresh-secret',
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: RefreshPayload): AuthenticatedUser {
    if (payload.tokenType !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const refreshToken = this.extractBearerToken(request);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    return {
      ...payload,
      refreshToken,
    };
  }

  private extractBearerToken(request: Request): string | undefined {
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
      return undefined;
    }

    return token;
  }
}
