import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModal: Model<UserDocument>,
  ) {}

  async create(user: CreateUserDto): Promise<UserDocument> {
    return await this.userModal.create(user);
  }

  async update(user: UserDocument): Promise<UserDocument> {
    return this.userModal.findByIdAndUpdate(user._id, user);
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    return await this.userModal.findOne({ email });
  }

  async findOneById(id: string): Promise<UserDocument> {
    return this.userModal.findById(id);
  }

  async findOneByMnemonic(mnemonic: string): Promise<UserDocument> {
    return this.userModal.findOne({ mnemonic });
  }
}