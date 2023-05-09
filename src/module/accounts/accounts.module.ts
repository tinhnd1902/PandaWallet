import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Account } from './entities/account.entity';
import { Transaction } from '../transations/entities/transation.entity';
import { UsersModule } from '../users/users.module';
import { ProfileModule } from '../profile/profile.module';
import { TransationsModule } from '../transations/transations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Account, Transaction]),
    UsersModule,
    ProfileModule,
    TransationsModule,
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
