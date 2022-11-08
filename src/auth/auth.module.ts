import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt/dist';
import { JwtConstant } from '../config/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: JwtConstant.secret,
            signOptions: { expiresIn: JwtConstant.expiresIn },
        }),
    
  ],
  providers: [AuthService, JwtStrategy, UserRepository],
})
export class AuthModule {}
