import { Controller } from '@nestjs/common';
import { TransactionsService } from './transations.service';

@Controller('transations')
export class TransationsController {
  constructor(private readonly transationsService: TransactionsService) {}
}
