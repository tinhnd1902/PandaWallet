import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TransationsModule } from './module/transations/transations.module';
import { AccountsModule } from './module/accounts/accounts.module';
import { UsersModule } from './module/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ormConfig } from './orm.config';
import { AuthModule } from './module/auth/auth.module';
import { ProfileModule } from './module/profile/profile.module';
import { BotTelegramModule } from './module/bot-telegram/bot-telegram.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AccountsModule,
    TransationsModule,
    BotTelegramModule,
    TypeOrmModule.forRoot(ormConfig),
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
