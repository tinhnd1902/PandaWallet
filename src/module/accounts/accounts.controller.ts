import { Controller, Post, Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('create')
  create(@Body() req) {
    return this.accountsService.transferMoney(
      req.usernameSend,
      req.usernameReceive,
      req.amount,
    );
  }
}
