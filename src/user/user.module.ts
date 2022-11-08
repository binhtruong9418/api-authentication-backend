import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { BlockchainService } from '../blockchain/blockchain.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, AuthService, JwtService, BlockchainService],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), PassportModule.register({ session: true }), AuthModule],
})
export class UserModule {}
