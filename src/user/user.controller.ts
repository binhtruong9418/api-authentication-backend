import { Controller, Post, Body, UseGuards, Res, Put, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserResponse } from '../config/interface/UserResponse.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/config/get-user.decorator';
import { Response } from 'express';
import { ValidateMnemonicDto } from './dto/validate-mnemonic.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'User register' })
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'User login' })
  @Post('signin')
  async login(@Body() user: CreateUserDto, @Res() res: Response) {
    return await this.userService.login(user, res);
  }

  @ApiOperation({ summary: "Create mnemonic" })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('create-mnemonic')
  async createMnemonic(@GetUser() user: any) {
    return await this.userService.createMnemonic(user);
  }

  @ApiOperation({ summary: "Add existing mnemonic" })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('add-existing-mnemonic')
  async addMnemonic(@GetUser() user: any, @Body() validateMnemonicDto: ValidateMnemonicDto) {
    return await this.userService.addExistingMnemonic(
      user,
      validateMnemonicDto.mnemonic
    );
  }

  @ApiOperation({ summary: "Validate mnemonic" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('validate-mnemonic')
  async validateMnemonic(@GetUser() user: any, @Body() validateMnemonicDto: ValidateMnemonicDto) {
    return await this.userService.validateMnemonic(
      user,
      validateMnemonicDto.mnemonic
    );
  }

  @ApiOperation({ summary: "Get address" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('get-address')
  async getAddress(@GetUser() user: any) {
    return await this.userService.getAddress(user);
  }

}
