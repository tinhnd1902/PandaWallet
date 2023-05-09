import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { Account } from '../accounts/entities/account.entity';
import { ProfileModule } from '../profile/profile.module';
import { AccountsModule } from '../accounts/accounts.module';
import { TransationsModule } from '../transations/transations.module';
import { Transaction } from '../transations/entities/transation.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Account, Transaction]),
    ProfileModule,
    AccountsModule,
    TransationsModule,
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
