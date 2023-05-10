import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { TransactionsModule } from '../transations/transations.module';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { Transaction } from '../transations/entities/transation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, User, Transaction]),
    UsersModule,
    TransactionsModule,
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
