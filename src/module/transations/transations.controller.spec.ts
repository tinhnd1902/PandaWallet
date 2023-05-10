import { Test, TestingModule } from '@nestjs/testing';

import { TransationsController } from './transations.controller';
import { TransactionsService } from './transations.service';

describe('TransactionsController', () => {
  let controller: TransationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransationsController],
      providers: [TransactionsService],
    }).compile();

    controller = module.get<TransationsController>(TransationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
