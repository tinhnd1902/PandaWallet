import { Controller, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AccountsService } from '../accounts/accounts.service';
import { ProfileService } from '../profile/profile.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly profileService: ProfileService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const result = await this.authService.validateUser(
      req.body.username,
      req.body.password,
    );
    if (result === null) {
      return 'Username or password is not correct';
    }
    return this.authService.login(req.body);
  }

  @Post('register')
  async register(@Request() req) {
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
}
