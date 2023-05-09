import { Module } from '@nestjs/common';
import { TransactionsService } from './transations.service';
import { TransationsController } from './transations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Account } from '../accounts/entities/account.entity';
import { Profile } from '../profile/entities/profile.entity';
import { AccountsModule } from '../accounts/accounts.module';
import { UsersModule } from '../users/users.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Account, Profile]),
    AccountsModule,
    UsersModule,
    ProfileModule,
  ],
  controllers: [TransationsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransationsModule {}
