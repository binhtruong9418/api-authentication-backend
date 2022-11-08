import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { UserResponse } from '../config/interface/UserResponse.interface';
import { User, UserDocument } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { Response } from 'express';
import { BlockchainService } from '../blockchain/blockchain.service';
import { Logger} from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly blockchainService: BlockchainService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = await this.validateRegister(createUserDto);
    if (user) {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashedPassword;
      const newUser = await this.userRepository.create(createUserDto);
      return await this.buildResponse(newUser);
    }
  }

  async validateRegister(user: CreateUserDto): Promise<Boolean> {
    const { email } = user;
    const userExist = await this.userRepository.findOneByEmail(email);
    if (userExist) {
      throw new BadRequestException('User already exists');
    }
    return true;
  }

  async buildResponse(user: UserDocument): Promise<UserResponse> {
    return {
      id: user._id,
      email: user.email,
    };
  }

  async login(loginUserDto: CreateUserDto, res: Response) {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (user) {
      const token = await this.authService.createAccessToken(user);
      res.cookie('jwt', token, { httpOnly: true }).status(200).send({ token });
      return token;
    }
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const userExist = await this.userRepository.findOneByEmail(email);
    if (!userExist) {
      throw new BadRequestException('User does not exist');
    }
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      throw new BadRequestException('Password is incorrect');
    }
    return await userExist;
  }

  async createMnemonic(user: UserDocument): Promise<any> {
    try {
      const mnemonic = await this.blockchainService.createMnemonic();
      user.mnemonic = await this.blockchainService.encryptMnemonic(mnemonic);
      await this.userRepository.update(user);
      return mnemonic;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async validateMnemonic(user: UserDocument, mnemonic: string): Promise<any> {
    if (!this.blockchainService.checkMnemonic(mnemonic)) {
      throw new BadRequestException('Mnemonic is not valid');
    }

    const decryptedMnemonic = await this.blockchainService.decryptMnemonic(
      user.mnemonic,
    );
    if (decryptedMnemonic !== mnemonic) {
      throw new BadRequestException('Invalid! Mnenomic does not match');
    }

    user.verifiedMnemonic = true;
    await this.userRepository.update(user);
    return true;
  }

  async addExistingMnemonic(
    user: UserDocument,
    mnemonic: string,
  ): Promise<any> {
    if (!this.blockchainService.checkMnemonic(mnemonic)) {
      throw new BadRequestException('Mnemonic is not valid');
    }

    const encryptMnemonic = await this.blockchainService.encryptMnemonic(
      mnemonic,
    );
    const oldUser = await this.userRepository.findOneByMnemonic(
      encryptMnemonic,
    );
    if (!oldUser) {
      return false;
    }

    return await this.authService.createAccessToken(oldUser);
  }

  getAddress = async (user: UserDocument) => {
    if (!user.verifiedMnemonic) {
      throw new BadRequestException('Mnemonic not verified');
    }

    const mnemonic = await this.blockchainService.decryptMnemonic(user.mnemonic)
    const address = await this.blockchainService.createWallet(mnemonic, user.accountId)
    user.accountId += 1;
    await this.userRepository.update(user);
    return address;
  }

  randomAlphanumeric(length) {
    const chars = '0123456789';
    let result = '';
    for (let i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
}
