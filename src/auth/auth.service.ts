import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtConstant } from 'src/config/constants';

@Injectable()
export class AuthService {
  constructor(
      private readonly userRepository: UserRepository,
      private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }

    async createAccessToken(user: any) {
        const payload = { email: user.email, sub: user._id, password: user.password };
        return await this.jwtService.sign(payload, { secret: JwtConstant.secret, expiresIn: JwtConstant.expiresIn });
    }
}
