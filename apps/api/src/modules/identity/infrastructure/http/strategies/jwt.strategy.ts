import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser } from '../../../application/interfaces/authenticated-user.interface';

type JwtPayload = Omit<AuthenticatedUser, 'refreshToken'>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_ACCESS_TOKEN_SECRET') ?? 'foodmesh-access-secret',
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    if (payload.tokenType !== 'access') {
      throw new UnauthorizedException('Invalid access token.');
    }

    return payload;
  }
}
