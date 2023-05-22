import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { TransactionsService } from '../transations/transations.service';
import { Transaction } from '../transations/entities/transation.entity';
import { BotTelegramController } from './bot-telegram.controller';
import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/entities/account.entity';
import { Profile } from '../profile/entities/profile.entity';
import { ProfileService } from '../profile/profile.service';
import { BotTelegramService } from './bot-telegram.service';
import { Backup } from '../backup/entities/backup.entity';
import { BackupService } from '../backup/backup.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([User, Profile, Account, Transaction, Backup]),
  ],
  controllers: [BotTelegramController],
  providers: [
    BotTelegramService,
    AuthService,
    UsersService,
    JwtService,
    AccountsService,
    ProfileService,
    TransactionsService,
    BackupService,
  ],
})
export class BotTelegramModule {}
