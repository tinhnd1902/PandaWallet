import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TransactionsController } from './transations.controller';
import { Account } from '../accounts/entities/account.entity';
import { TransactionsService } from './transations.service';
import { Transaction } from './entities/transation.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account, User])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
