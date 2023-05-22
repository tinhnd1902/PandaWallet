import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateTransactionDto } from './dto/create-transation.dto';
import { TransactionsService } from './transations.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('create')
  async createTransaction(@Body() createTransaction: CreateTransactionDto) {
    return await this.transactionsService.createTransaction(createTransaction);
  }

  @Get(':id')
  async getTransaction(@Param('id') id: string) {
    return await this.transactionsService.getOneTransactionById(id);
  }

  @Get()
  async test(@Body() req: any) {
    return this.transactionsService.getTransactionSortId(req.id);
  }
}
