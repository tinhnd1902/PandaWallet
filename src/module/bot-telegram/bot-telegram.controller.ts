import { Controller } from '@nestjs/common';

import { BotTelegramService } from './bot-telegram.service';

@Controller('bot-telegram')
export class BotTelegramController {
  constructor(private readonly botTelegramService: BotTelegramService) {}
}
