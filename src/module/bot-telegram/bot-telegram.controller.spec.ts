import { Test, TestingModule } from '@nestjs/testing';
import { BotTelegramController } from './bot-telegram.controller';
import { BotTelegramService } from './bot-telegram.service';

describe('BotTelegramController', () => {
  let controller: BotTelegramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotTelegramController],
      providers: [BotTelegramService],
    }).compile();

    controller = module.get<BotTelegramController>(BotTelegramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
