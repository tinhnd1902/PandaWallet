import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { BotTelegramModule } from './module/bot-telegram/bot-telegram.module';
import { TransactionsModule } from './module/transations/transations.module';
import { AccountsModule } from './module/accounts/accounts.module';
import { ProfileModule } from './module/profile/profile.module';
import { BackupModule } from './module/backup/backup.module';
import { UsersModule } from './module/users/users.module';
import { AuthModule } from './module/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ormConfig } from './orm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    TransactionsModule,
    BotTelegramModule,
    AccountsModule,
    ProfileModule,
    UsersModule,
    AuthModule,
    BackupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
