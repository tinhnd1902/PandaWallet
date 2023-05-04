import { Module } from '@nestjs/common';
import { TransationsService } from './transations.service';
import { TransationsController } from './transations.controller';

@Module({
  controllers: [TransationsController],
  providers: [TransationsService]
})
export class TransationsModule {}
