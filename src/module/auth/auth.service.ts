import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    const User = await this.usersService.findOneByUsername(username);
    if (User && bcrypt.compareSync(password, User.password)) {
      return 'Validate Done';
    }
    return null;
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }

  async login(req: any) {
    const payload = { username: req.username, password: req.password };
    return {
      access_token: this.jwtService.sign(payload),
      username: payload.username,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }
}
