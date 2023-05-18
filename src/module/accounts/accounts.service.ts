import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAccountDto } from './dto/create-account.dto';
import { Backup } from '../backup/entities/backup.entity';
import { BackupService } from '../backup/backup.service';
import { User } from '../users/entities/user.entity';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Backup) private backupRepository: Repository<Backup>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly backupService: BackupService,
  ) {}

  async createAccount(username: string, createAccountDto: CreateAccountDto) {
    const user = await this.userRepository.findOneBy({
      username: username,
    });

    if (user) {
      const newAccount = this.accountRepository.create({
        ...createAccountDto,
        user,
        createAt: new Date(),
      });

      await this.accountRepository.save(newAccount);

      const updatedUser = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['accounts'],
      });

      return updatedUser.accounts;
    }

    throw new HttpException(
      'User not found. Cannot create account.',
      HttpStatus.BAD_REQUEST,
    );
  }

  async checkingBalance(username: string) {
    const checkUser = await this.userRepository.find({
      where: { username: username },
      relations: ['accounts'],
    });
    if (
      checkUser &&
      !(checkUser.length === 0) &&
      !(checkUser[0].accounts.length === 0)
    ) {
      return {
        accountNumber: checkUser[0].accounts[0].accountNumber,
        balance: checkUser[0].accounts[0].balance,
      };
    }
    return 'User Not Found. Cannot checking balance';
  }

  async depositMoney(username: string, deposit: string) {
    const checkUser = await this.userRepository.find({
      where: { username: username },
      relations: ['accounts'],
    });
    if (
      checkUser &&
      !(checkUser.length === 0) &&
      !(checkUser[0].accounts.length === 0) &&
      Number(deposit) > 0
    ) {
      return await this.accountRepository.update(checkUser[0].accounts[0].id, {
        accountNumber: '1',
        balance: String(
          Number(checkUser[0].accounts[0].balance) + Number(deposit),
        ),
      });
    }
    return 'Deposit Error';
  }

  async withdrawMoney(username: string, withdraw: string) {
    const checkUser = await this.userRepository.find({
      where: { username: username },
      relations: ['accounts'],
    });
    if (
      checkUser &&
      !(checkUser.length === 0) &&
      !(checkUser[0].accounts.length === 0) &&
      Number(withdraw) > 0 &&
      Number(checkUser[0].accounts[0].balance) >= Number(withdraw)
    ) {
      return await this.accountRepository.update(checkUser[0].accounts[0].id, {
        accountNumber: '1',
        balance: String(
          Number(checkUser[0].accounts[0].balance) - Number(withdraw),
        ),
      });
    }
    return 'Withdraw Error';
  }

  async transferMoney(
    usernameSend: string,
    usernameReceive: string,
    amount: string,
  ) {
    const CheckUserSend = await this.userRepository.find({
      where: { username: usernameSend },
      relations: ['accounts'],
    });
    if (!CheckUserSend) {
      throw new HttpException('Invalid source account', HttpStatus.BAD_REQUEST);
    }
    const CheckUserReceive = await this.userRepository.find({
      where: { username: usernameReceive },
      relations: ['accounts'],
    });
    if (CheckUserReceive.length === 0) {
      return 'Invalid destination account';
    } else {
      if (
        CheckUserReceive &&
        CheckUserSend &&
        amount &&
        Number(CheckUserSend[0].accounts[0].balance) > Number(amount) &&
        !(CheckUserReceive === CheckUserSend)
      ) {
        await this.accountRepository.update(CheckUserSend[0].accounts[0].id, {
          accountNumber: '1',
          balance: String(
            Number(CheckUserSend[0].accounts[0].balance) - Number(amount),
          ),
        });
        await this.accountRepository.update(
          CheckUserReceive[0].accounts[0].id,
          {
            accountNumber: '1',
            balance: String(
              Number(CheckUserReceive[0].accounts[0].balance) + Number(amount),
            ),
          },
        );
        return 'Transfer Successfully';
      }
      return 'An error has occurred';
    }
  }

  async transferUsernameTelegram(
    usernameSend: string,
    usernameReceive: string,
    amount: string,
  ) {
    const CheckUserSend = await this.userRepository.find({
      where: { username: usernameSend },
      relations: ['accounts'],
    });
    const CheckUserReceive = await this.userRepository.find({
      where: { usernameTelegram: usernameReceive },
      relations: ['accounts'],
    });

    if (
      CheckUserReceive.length === 0 &&
      CheckUserSend &&
      amount &&
      Number(CheckUserSend[0].accounts[0].balance) > Number(amount) &&
      !(CheckUserReceive === CheckUserSend)
    ) {
      await this.backupService.create({
        userTelegram: usernameReceive,
        backupBalance: amount,
        sourceAccount: usernameSend,
      });
      await this.accountRepository.update(CheckUserSend[0].accounts[0].id, {
        accountNumber: '1',
        balance: String(
          Number(CheckUserSend[0].accounts[0].balance) - Number(amount),
        ),
      });
      return 'Transfer Successfully';
    } else {
      if (
        CheckUserReceive &&
        CheckUserSend &&
        amount &&
        Number(CheckUserSend[0].accounts[0].balance) > Number(amount) &&
        !(CheckUserReceive === CheckUserSend)
      ) {
        await this.accountRepository.update(CheckUserSend[0].accounts[0].id, {
          accountNumber: '1',
          balance: String(
            Number(CheckUserSend[0].accounts[0].balance) - Number(amount),
          ),
        });
        await this.accountRepository.update(
          CheckUserReceive[0].accounts[0].id,
          {
            accountNumber: '1',
            balance: String(
              Number(CheckUserReceive[0].accounts[0].balance) + Number(amount),
            ),
          },
        );
        return 'Transfer Successfully';
      }
      return 'An error has occurred';
    }
  }

  async handleBackup(username: string, usernameTelegram: string) {
    const checkUsernameTelegram = await this.backupRepository.findOne({
      where: {
        userTelegram: usernameTelegram,
      },
    });
    const checkUsername = await this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: ['accounts'],
    });
    if (checkUsernameTelegram && checkUsername) {
      await this.accountRepository.update(checkUsername.accounts[0].id, {
        accountNumber: '1',
        balance: String(
          Number(checkUsername.accounts[0]?.balance) +
            Number(checkUsernameTelegram?.backupBalance),
        ),
      });
      await this.backupRepository.delete(checkUsernameTelegram.id);
    }
  }
}
