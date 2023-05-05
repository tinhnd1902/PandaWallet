import { Module } from '@nestjs/common';
import { BotTelegramService } from './bot-telegram.service';
import { BotTelegramController } from './bot-telegram.controller';

@Module({
  controllers: [BotTelegramController],
  providers: [BotTelegramService],
})
export class BotTelegramModule {}
