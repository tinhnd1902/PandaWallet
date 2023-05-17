import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Transaction } from '../transations/entities/transation.entity';
import { TransactionsModule } from '../transations/transations.module';
import { Profile } from '../profile/entities/profile.entity';
import { AccountsController } from './accounts.controller';
import { Backup } from '../backup/entities/backup.entity';
import { BackupService } from '../backup/backup.service';
import { User } from '../users/entities/user.entity';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, User, Transaction, Backup, Profile]),
    UsersModule,
    TransactionsModule,
  ],
  controllers: [AccountsController],
  providers: [AccountsService, BackupService],
  exports: [AccountsService],
})
export class AccountsModule {}
