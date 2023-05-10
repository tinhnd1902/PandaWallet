import { InjectRepository } from '@nestjs/typeorm';
import { ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AccountsService } from '../accounts/accounts.service';
import { ProfileService } from '../profile/profile.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly profileService: ProfileService,
  ) {}

  @Post('register')
  async register(@Req() req) {
    const user = await this.userService.findOneByUsername(req.body.username);
    if (!user) {
      await this.authService.register(req.body);
      await this.profileService.createProfile(req.body.username, {
        email: '',
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        address: '',
      });
      await this.accountsService.createAccount(req.body.username, {
        accountNumber: '1',
        balance: '0',
      });
      return await this.userRepository.find({
        where: { username: req.body.username },
        relations: ['profile', 'accounts'],
      });
    }
    return 'Username already exists';
  }

  @Post('login')
  async login(@Req() req) {
    const result = await this.authService.validateUser(
      req.body.username,
      req.body.password,
    );
    if (result === null) {
      return 'Username or password is not correct';
    }
    return this.authService.login(req.body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: any) {
    // Wait
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: any) {
    // Wait
  }

  @Get('test')
  @UseGuards(AuthGuard)
  test() {
    return 'test';
  }
}
