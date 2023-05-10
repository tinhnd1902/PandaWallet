import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { BotTelegramModule } from './module/bot-telegram/bot-telegram.module';
import { TransactionsModule } from './module/transations/transations.module';
import { AccountsModule } from './module/accounts/accounts.module';
import { ProfileModule } from './module/profile/profile.module';
import { UsersModule } from './module/users/users.module';
import { AuthModule } from './module/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ormConfig } from './orm.config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AccountsModule,
    TransactionsModule,
    BotTelegramModule,
    TypeOrmModule.forRoot(ormConfig),
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
