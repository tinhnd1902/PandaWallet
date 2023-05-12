import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { TransactionsService } from './transations.service';
import { CreateTransactionDto } from './dto/create-transation.dto';

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
}
