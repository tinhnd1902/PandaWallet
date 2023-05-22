import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Markup, Telegraf } from 'telegraf';
import { Cache } from 'cache-manager';
import * as dotenv from 'dotenv';

import { TransactionsService } from '../transations/transations.service';
import { AccountsService } from '../accounts/accounts.service';
import { ProfileService } from '../profile/profile.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

interface Data {
  action: string;
  step: number;
  amount: string;
  description: string;
  receiver?: string;
}

@Injectable()
export class BotTelegramService {
  private bot: Telegraf;
  private keyboardMarkup = Markup.inlineKeyboard([
    [
      Markup.button.callback('Deposit', 'deposit'),
      Markup.button.callback('Withdraw', 'withdraw'),
    ],
    [
      Markup.button.callback('Transfer ID', 'transferId'),
      Markup.button.callback('Transfer Username', 'transferUsername'),
    ],
    [
      Markup.button.callback('Balance', 'balance'),
      Markup.button.callback('History', 'history'),
    ],
  ]);
  private keyboardMarkupHistory = Markup.inlineKeyboard([
    [
      Markup.button.callback('List History', 'listHistory'),
      Markup.button.callback('Search History', 'searchHistory'),
    ],
  ]);

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly transactionService: TransactionsService,
    private readonly accountsService: AccountsService,
    private readonly profileService: ProfileService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {
    this.bot = new Telegraf(TELEGRAM_BOT_TOKEN);
    this.bot.start(this.handleStartCommand.bind(this));
    this.bot.on('text', this.handleTextMessage.bind(this));
    this.bot.action(/.*/, this.handleButtonClick.bind(this));
    this.bot.launch();
  }

  async handleStartCommand(ctx: any): Promise<void> {
    const options = {
      id: String(ctx.update.message.from.id),
      username: ctx.update.message.from.username,
      lastName: ctx.update.message.from.last_name,
      firstName: ctx.update.message.from.first_name,
    };
    const checkIdTelegram = await this.userService.findOneByUsername(
      options.id,
    );

    if (!checkIdTelegram) {
      await this.registerUser(options.id, options.id, options.username);
      const usernameTelegram = await this.userService.findOneByUsernameTelegram(
        options.username,
      );
      if (usernameTelegram) {
        await this.accountsService.handleBackup(options.id, options.username);
      }
    }
    await ctx.reply(
      `Hi ${options.firstName} ${options.lastName}, I'm Panda. Can I help you?`,
      this.keyboardMarkup,
    );
  }

  async handleTextMessage(ctx: any): Promise<void> {
    const options = {
      id: String(ctx.update.message.from.id),
      username: ctx.update.message.from.username,
      lastName: ctx.update.message.from.last_name,
      firstName: ctx.update.message.from.first_name,
      contentText: ctx.message.text,
    };

    const data: Data = (await this.cache.get(options.id)) as Data;

    if (!data) {
      return await ctx.reply(
        'You are not in any transactions or transaction timeout. Please try again',
        this.keyboardMarkup,
      );
    }

    switch (data.action) {
      case 'deposit':
        if (data.step === 1) {
          const depositAmount = parseFloat(options.contentText);
          if (!isNaN(depositAmount) && Number(depositAmount) > 0) {
            data.amount = options.contentText;
            data.step = 2;
            await this.cache.set(options.id, data, 30000);
            await ctx.reply('Please enter description:', Markup.forceReply());
          } else {
            await this.cache.del(options.id);
            await ctx.reply(
              'Deposit failed. Please check the amount again and repeat the steps',
              this.keyboardMarkup,
            );
          }
        } else if (data.step === 2) {
          data.description = options.contentText;
          await this.cache.set(options.id, data, 30000);
          const deposit = await this.accountsService.depositMoney(
            options.id,
            data.amount,
          );
          if (deposit) {
            const infoTransaction =
              await this.transactionService.createTransaction({
                sourceAccount: options.id,
                destinationAccount: options.id,
                description: data.description,
                amount: data.amount,
                type: 'deposit',
              });
            await ctx.reply(
              `Deposit Successfully.\n Transaction ID: ${infoTransaction.id}`,
            );
            await ctx.reply('Can I help you, next?', this.keyboardMarkup);
          }
          await this.cache.del(options.id);
        }
        break;

      case 'withdraw':
        if (data.step === 1) {
          const withdrawAmount = parseFloat(options.contentText);
          if (!isNaN(withdrawAmount) && Number(withdrawAmount) > 0) {
            data.amount = options.contentText;
            data.step = 2;
            await this.cache.set(options.id, data, 30000);
            await ctx.reply('Please enter description:', Markup.forceReply());
          } else {
            await this.cache.del(options.id);
            await ctx.reply(
              'Withdraw failed. Please check the amount again and repeat the steps',
              this.keyboardMarkup,
            );
          }
        } else if (data.step === 2) {
          data.description = options.contentText;
          await this.cache.set(options.id, data, 30000);
          const withdraw = await this.accountsService.withdrawMoney(
            options.id,
            data.amount,
          );
          if (withdraw !== 'Withdraw Error') {
            const infoTransaction =
              await this.transactionService.createTransaction({
                sourceAccount: options.id,
                destinationAccount: options.id,
                description: data.description,
                amount: data.amount,
                type: 'withdraw',
              });
            await this.cache.del(options.id);
            await ctx.reply(
              `Withdraw Successfully.\n Transaction ID: ${infoTransaction.id}`,
            );
            await ctx.reply('Can I help you, next?', this.keyboardMarkup);
          } else {
            await this.cache.del(options.id);
            await ctx.reply(
              'Withdraw failed. Please check the amount again and repeat the steps',
              this.keyboardMarkup,
            );
          }
        }
        break;

      case 'transferId':
        if (data.step === 1) {
          data.receiver = options.contentText;
          data.step = 2;
          await this.cache.set(options.id, data, 30000);
          await ctx.reply('Please enter amount:', Markup.forceReply());
        } else if (data.step === 2) {
          data.amount = options.contentText;
          data.step = 3;
          await this.cache.set(options.id, data, 30000);
          await ctx.reply('Please enter description:', Markup.forceReply());
        } else if (data.step === 3) {
          data.description = options.contentText;
          const transfer = await this.accountsService.transferMoney(
            options.id,
            data.receiver,
            data.amount,
          );
          if (transfer === 'Transfer Successfully') {
            const infoTransaction =
              await this.transactionService.createTransaction({
                sourceAccount: options.id,
                destinationAccount: data.receiver,
                description: data.description,
                amount: data.amount,
                type: 'transferId',
              });
            await this.cache.del(options.id);
            await ctx.reply(
              `TransferId Successfully.\n Transaction ID: ${infoTransaction.id}`,
            );
          } else {
            await this.cache.del(options.id);
            await ctx.reply(
              'TransferId failed. Please check the id or amount again and repeat the steps',
            );
          }
          await ctx.reply('Can I help you, next?', this.keyboardMarkup);
        }
        break;

      case 'transferUsername':
        if (data.step === 1) {
          data.receiver = options.contentText;
          data.step = 2;
          await this.cache.set(options.id, data, 30000);
          await ctx.reply('Please enter amount:', Markup.forceReply());
        } else if (data.step === 2) {
          data.amount = options.contentText;
          data.step = 3;
          await this.cache.set(options.id, data, 30000);
          await ctx.reply('Please enter description:', Markup.forceReply());
        } else if (data.step === 3) {
          data.description = options.contentText;
          const transfer = await this.accountsService.transferUsernameTelegram(
            options.id,
            data.receiver,
            data.amount,
          );
          if (transfer === 'Transfer Successfully') {
            const infoTransaction =
              await this.transactionService.createTransactionUsername({
                sourceAccount: options.id,
                destinationAccount: data.receiver,
                description: data.description,
                amount: data.amount,
                type: 'transferUsername',
              });
            await this.cache.del(options.id);
            await ctx.reply(
              `TransferUsername Successfully.\n Transaction ID: ${infoTransaction.id}`,
            );
          } else {
            await this.cache.del(options.id);
            await ctx.reply(
              'TransferUsername failed. Please check the username or amount again and repeat the steps',
            );
          }
          await ctx.reply('Can I help you, next?', this.keyboardMarkup);
        }
        break;

      case 'searchHistory':
        if (data.step === 1) {
          const searchHistory =
            await this.transactionService.getOneTransactionById(
              options.contentText,
            );
          if (typeof searchHistory !== 'string') {
            if (
              String(options.id) === searchHistory?.sourceAccount ||
              String(options.id) === searchHistory?.destinationAccount
            ) {
              await ctx.reply(
                `Transaction Id:\n ${searchHistory?.id}\n 
                        Amount: ${searchHistory?.amount}\n 
                        Description: ${searchHistory?.description}\n 
                        Type: ${searchHistory?.type}\n 
                        Source Account: ${
                          searchHistory?.type === 'deposit'
                            ? ''
                            : searchHistory?.sourceAccount
                        }\n 
                        Destination Account: ${
                          searchHistory?.type === 'withdraw'
                            ? ''
                            : searchHistory?.destinationAccount
                        }\n
                        CreateAt: ${this.formatDate(
                          String(searchHistory.createdAt),
                        )}`,
              );
            } else {
              await ctx.reply(`Sorry, this transaction doesn't belong to you`);
            }
          } else {
            await ctx.reply(`Transaction not found`);
          }
          await this.cache.del(options.id);
          await ctx.reply('Can I help you, next?', this.keyboardMarkup);
        }
        break;

      case 'listHistory':
        if (data.step === 1) {
          const number = parseFloat(options.contentText);
          const listHistory =
            await this.transactionService.getTransactionSortId(options.id);
          if (
            !isNaN(number) &&
            Number(number) > 0 &&
            Number(number) < 100 &&
            listHistory.length > number
          ) {
            await ctx.reply(
              `Here are your last ${number}/${listHistory.length} total transactions`,
            );
            const newListHistory = listHistory.slice(0, number);
            for (const item of newListHistory) {
              await ctx.reply(`Transaction Id:\n ${item?.id}\n
                        Amount: ${item?.amount}\n
                        Description: ${item?.description}\n
                        Type: ${item?.type}\n
                        Source Account: ${
                          item?.type === 'deposit' ? '' : item?.sourceAccount
                        }\n
                        Destination Account: ${
                          item?.type === 'withdraw'
                            ? ''
                            : item?.destinationAccount
                        }\n
                        CreateAt: ${this.formatDate(String(item.createdAt))}`);
            }
          } else {
            await ctx.reply('Sorry, Number invalid');
          }
          await this.cache.del(options.id);
          await ctx.reply('Can I help you, next?', this.keyboardMarkup);
        }
        break;

      default:
        await ctx.reply('Sorry, I dont understand', this.keyboardMarkup);
        break;
    }
  }

  async handleButtonClick(ctx: any): Promise<void> {
    const options = {
      id: String(ctx.update.callback_query.from.id),
      username: ctx.update.callback_query.from.username,
      lastName: ctx.update.callback_query.from.last_name,
      firstName: ctx.update.callback_query.from.first_name,
      data: ctx.update.callback_query.data,
    };

    const data: Data = ((await this.cache.get(options.id)) as Data) || {
      action: '',
      step: 1,
      amount: '',
      description: '',
    };

    switch (options.data) {
      case 'deposit':
        if (data.action === '') {
          await this.cache.set(
            options.id,
            {
              action: 'deposit',
              step: 1,
              amount: '',
              description: '',
            },
            30000,
          );
          await ctx.reply(
            'How much money would you like to deposit?',
            Markup.forceReply(),
          );
        } else {
          await ctx.reply(
            `You are in session ${data.action}, please complete the transaction or wait 30 seconds for the session to end`,
          );
        }
        break;

      case 'withdraw':
        if (data.action === '') {
          await this.cache.set(
            options.id,
            {
              action: 'withdraw',
              step: 1,
              amount: '',
              description: '',
            },
            30000,
          );
          await ctx.reply(
            'How much money would you like to withdraw?',
            Markup.forceReply(),
          );
        } else {
          await ctx.reply(
            `You are in session ${data.action}, please complete the transaction or wait 30 seconds for the session to end`,
          );
        }
        break;

      case 'transferId':
        if (data.action === '') {
          await this.cache.set(
            options.id,
            {
              action: 'transferId',
              step: 1,
              amount: '',
              description: '',
            },
            30000,
          );
          await ctx.reply(
            'Which id do you want to go to?',
            Markup.forceReply(),
          );
        } else {
          await ctx.reply(
            `You are in session ${data.action}, please complete the transaction or wait 30 seconds for the session to end`,
          );
        }
        break;

      case 'transferUsername':
        if (data.action === '') {
          await this.cache.set(
            options.id,
            {
              action: 'transferUsername',
              step: 1,
              amount: '',
              description: '',
            },
            30000,
          );
          await ctx.reply(
            'Which username do you want to go to?',
            Markup.forceReply(),
          );
        } else {
          await ctx.reply(
            `You are in session ${data.action}, please complete the transaction or wait 30 seconds for the session to end`,
          );
        }
        break;

      case 'balance':
        if (data.action === '') {
          await this.cache.set(
            options.id,
            {
              action: 'balance',
              step: 1,
              amount: '',
              description: '',
            },
            30000,
          );
          await this.accountsService.handleBackup(options.id, options.username);
          const checking = await this.accountsService.checkingBalance(
            options.id,
          );
          if (checking === 'User Not Found. Cannot checking balance') {
            await this.cache.del(options.id);
            await ctx.reply(
              'User not found. Unable to check balance',
              this.keyboardMarkup,
            );
            await ctx.reply('Can I help you, next?', this.keyboardMarkup);
          } else {
            const { balance } = checking;
            await this.cache.del(options.id);
            await ctx.reply(
              `Your account currently has a balance of ${balance}`,
            );
            await ctx.reply('Can I help you, next?', this.keyboardMarkup);
          }
        } else {
          await ctx.reply(
            `You are in session ${data.action}, please complete the transaction or wait 30 seconds for the session to end`,
          );
        }
        break;

      case 'history':
        if (data.action === '') {
          await ctx.reply('choose type history', this.keyboardMarkupHistory);
        } else {
          await ctx.reply(
            `You are in session ${data.action}, please complete the transaction or wait 30 seconds for the session to end`,
          );
        }

        break;

      case 'listHistory':
        if (data.action === '') {
          await this.cache.set(
            options.id,
            {
              action: 'listHistory',
              step: 1,
              amount: '',
              description: '',
            },
            30000,
          );
          const listHistory =
            await this.transactionService.getTransactionSortId(options.id);
          await ctx.reply(
            `You have ${listHistory.length} transactions. How many transactions do you want to see (sorted from nearest to farthest)`,
            Markup.forceReply(),
          );
        } else {
          await ctx.reply(
            `You are in session ${data.action}, please complete the transaction or wait 30 seconds for the session to end`,
          );
        }
        break;

      case 'searchHistory':
        if (data.action === '') {
          await this.cache.set(
            options.id,
            {
              action: 'searchHistory',
              step: 1,
              amount: '',
              description: '',
            },
            30000,
          );
          await ctx.reply(
            'enter the transaction id you want to search',
            Markup.forceReply(),
          );
        } else {
          await ctx.reply(
            `You are in session ${data.action}, please complete the transaction or wait 30 seconds for the session to end`,
          );
        }
        break;

      default:
        await ctx.reply(`I don't understand`);
        await ctx.reply('Can I help you, next?', this.keyboardMarkup);
        break;
    }
  }

  registerUser = async (
    username: string,
    password: string,
    usernameTelegram: string,
  ) => {
    await this.authService.register({
      username: username,
      password: password,
      usernameTelegram: usernameTelegram,
    });

    await this.profileService.createProfile(username, {
      email: '',
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      address: '',
    });

    await this.accountsService.createAccount(username, {
      accountNumber: '1',
      balance: '0',
    });
  };

  formatDate = (date: string) => {
    const getDate = new Date(date);

    return getDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'UTC',
    });
  };
}
