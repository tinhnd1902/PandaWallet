import { Controller, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
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
      return this.authService.register(req.body);
    }
    return 'Username already exists';
  }
}
