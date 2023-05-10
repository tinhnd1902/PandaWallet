import { Module } from '@nestjs/common';
import { TransactionsService } from './transations.service';
import { TransationsController } from './transations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../accounts/entities/account.entity';
import { Transaction } from './entities/transation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account])],
  controllers: [TransationsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
