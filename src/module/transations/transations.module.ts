import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TransationsController } from './transations.controller';
import { Account } from '../accounts/entities/account.entity';
import { TransactionsService } from './transations.service';
import { Transaction } from './entities/transation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account])],
  controllers: [TransationsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
