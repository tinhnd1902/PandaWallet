import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransationDto } from './dto/create-transation.dto';
import { Account } from '../accounts/entities/account.entity';
import { Transaction } from './entities/transation.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  //Create a new transaction
  async createTransaction(
    sourceAccountId: string,
    destinationAccountId: string,
    createTransationDto: CreateTransationDto,
  ) {
    const sourceAccount = await this.accountRepository.findOne({
      where: {
        id: sourceAccountId,
      },
    });
    if (!sourceAccount) {
      throw new HttpException(
        'Invalid source account id',
        HttpStatus.BAD_REQUEST,
      );
    }

    const destinationAccount = await this.accountRepository.findOne({
      where: {
        id: destinationAccountId,
      },
    });
    if (!destinationAccount) {
      throw new HttpException(
        'Invalid destination account id',
        HttpStatus.BAD_REQUEST,
      );
    }

    const transaction = this.transactionRepository.create({
      ...createTransationDto,
      sourceAccount,
      destinationAccount,
    });
    await this.transactionRepository.save(transaction);

    return transaction;
  }

  //Get the details of a transaction.
  async getTransactionById(id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: id },
      relations: ['sourceAccount', 'destinationAccount'],
    });
    if (!transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }
    return transaction;
  }

  // //Get the list of transactions of an account
  // async getTransactionsByAccountId(id: string): Promise<Transaction[]> {
  //   const transactions = await this.transactionRepository.find({
  //     where: [{ sourceAccount: id }, { destinationAccount: id }],
  //   });
  //   return transactions;
  // }

  //Calculate the balance of an account based on the transactions made.
  async getAccountBalance(accountId: string) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: ['sourceTransactions', 'destinationTransactions'],
    });

    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    let balance = Number(account.balance);

    account.sourceTransactions.forEach((transaction) => {
      balance -= transaction.amount;
    });

    account.destinationTransactions.forEach((transaction) => {
      balance += transaction.amount;
    });

    return String(balance);
  }

  //Delete a transaction.
  async deleteTransaction(id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }
    await this.transactionRepository.remove(transaction);
  }
}
