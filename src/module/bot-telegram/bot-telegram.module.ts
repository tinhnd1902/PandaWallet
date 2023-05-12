import { Module } from '@nestjs/common';
import { BotTelegramService } from './bot-telegram.service';
import { BotTelegramController } from './bot-telegram.controller';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';
import { Account } from '../accounts/entities/account.entity';
import { AccountsService } from '../accounts/accounts.service';
import { ProfileService } from '../profile/profile.service';
import { TransactionsService } from '../transations/transations.service';
import { Transaction } from '../transations/entities/transation.entity';

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
