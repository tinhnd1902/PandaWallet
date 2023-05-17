import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/entities/account.entity';
import { Profile } from '../profile/entities/profile.entity';
import { ProfileService } from '../profile/profile.service';
import { Backup } from '../backup/entities/backup.entity';
import { BackupService } from '../backup/backup.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Account, Backup]),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    AccountsService,
    ProfileService,
    JwtStrategy,
    BackupService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
