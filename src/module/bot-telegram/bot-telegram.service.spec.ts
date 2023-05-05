import { Test, TestingModule } from '@nestjs/testing';
import { BotTelegramService } from './bot-telegram.service';

describe('BotTelegramService', () => {
  let service: BotTelegramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotTelegramService],
    }).compile();

    service = module.get<BotTelegramService>(BotTelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
