import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './module/users/users.module';
import { AccountsModule } from './module/accounts/accounts.module';
import { TransationsModule } from './module/transations/transations.module';

@Module({
  imports: [UsersModule, AccountsModule, TransationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
