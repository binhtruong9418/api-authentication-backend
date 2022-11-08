import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtConstant } from '../config/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService
  ) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: JwtConstant.secret,
      });
  }

  async validate(payload: any): Promise<any> {
    const user = await this.authService.validateUser(payload.email);
    if (!user) {
        throw new UnauthorizedException("sign in failed");
    }
    return user
  }

}
