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
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Account, Transaction])],
  controllers: [BotTelegramController],
  providers: [
    BotTelegramService,
    AuthService,
    UsersService,
    JwtService,
    AccountsService,
    ProfileService,
    TransactionsService,
  ],
})
export class BotTelegramModule {}
