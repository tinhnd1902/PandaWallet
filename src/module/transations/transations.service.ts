import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransactionDto } from './dto/create-transation.dto';
import { Account } from '../accounts/entities/account.entity';
import { Transaction } from './entities/transation.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //Create Transaction
  async createTransaction(createTransactionDto: CreateTransactionDto) {
    if (!createTransactionDto) {
      throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
    }
    const { amount, description, type, sourceAccount, destinationAccount } =
      createTransactionDto;
    const checkSourceAccount = await this.userRepository.findOne({
      where: {
        username: sourceAccount,
      },
    });
    const checkDestinationAccount = await this.userRepository.findOne({
      where: {
        username: destinationAccount,
      },
    });

    const currentDate = new Date();

    currentDate.setUTCHours(currentDate.getUTCHours() + 7);
    if (!checkSourceAccount) {
      throw new HttpException(
        'Invalid source account id',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!checkDestinationAccount) {
      throw new HttpException(
        'Invalid destination account id',
        HttpStatus.BAD_REQUEST,
      );
    }

    const transaction = this.transactionRepository.create({
      sourceAccount: String(sourceAccount),
      destinationAccount: String(destinationAccount),
      description,
      amount,
      type,
      createdAt: currentDate,
    });
    return this.transactionRepository.save(transaction);
  }

  async createTransactionUsername(createTransactionDto: CreateTransactionDto) {
    if (!createTransactionDto) {
      throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
    }
    const { amount, description, type, sourceAccount, destinationAccount } =
      createTransactionDto;

    const currentDate = new Date();

    currentDate.setUTCHours(currentDate.getUTCHours() + 7);

    const transaction = this.transactionRepository.create({
      sourceAccount: String(sourceAccount),
      destinationAccount: String(destinationAccount),
      description,
      amount,
      type,
      createdAt: currentDate,
    });
    return this.transactionRepository.save(transaction);
  }

  //Create a new transaction
  // async createTransaction(
  //   sourceAccountId: string,
  //   destinationAccountId: string,
  //   createTransactionDto: CreateTransactionDto,
  // ) {
  //   const sourceAccount = await this.accountRepository.findOne({
  //     where: {
  //       id: sourceAccountId,
  //     },
  //   });
  //   if (!sourceAccount) {
  //     throw new HttpException(
  //       'Invalid source account id',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //
  //   const destinationAccount = await this.accountRepository.findOne({
  //     where: {
  //       id: destinationAccountId,
  //     },
  //   });
  //   if (!destinationAccount) {
  //     throw new HttpException(
  //       'Invalid destination account id',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //
  //   const transaction = this.transactionRepository.create({
  //     ...createTransactionDto,
  //     sourceAccount,
  //     destinationAccount,
  //   });
  //   await this.transactionRepository.save(transaction);
  //
  //   return transaction;
  // }

  //Get the details of a transaction.
  async getOneTransactionById(id: string) {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id: id },
      });
      if (!transaction) {
        return 'Transaction not found';
      }
      return transaction;
    } catch (e) {
      return 'Something went wrong. Please check the id transaction again';
    }
  }

  // //Get the list of transactions of an account
  // async getTransactionsByAccountId(id: string): Promise<Transaction[]> {
  //   const transactions = await this.transactionRepository.find({
  //     where: [{ sourceAccount: id }, { destinationAccount: id }],
  //   });
  //   return transactions;
  // }

  //Calculate the balance of an account based on the transactions made.
  // async getAccountBalance(accountId: string) {
  //   const account = await this.accountRepository.findOne({
  //     where: { id: accountId },
  //     relations: ['sourceTransactions', 'destinationTransactions'],
  //   });
  //
  //   if (!account) {
  //     throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
  //   }
  //
  //   let balance = Number(account.balance);
  //
  //   account.sourceTransactions.forEach((transaction) => {
  //     balance -= transaction.amount;
  //   });
  //
  //   account.destinationTransactions.forEach((transaction) => {
  //     balance += transaction.amount;
  //   });
  //
  //   return String(balance);
  // }

  //Delete a transaction
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

  //get transaction sort for id
  async getTransactionSortId(id: string) {
    const listTransaction = await this.transactionRepository.find();

    const filteredData = listTransaction.filter(
      (obj) => obj.sourceAccount === id || obj.destinationAccount === id,
    );

    return filteredData.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }
}
