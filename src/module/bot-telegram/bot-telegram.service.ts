import * as TelegramBot from 'node-telegram-bot-api';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

import { TransactionsService } from '../transations/transations.service';
import { AccountsService } from '../accounts/accounts.service';
import { ProfileService } from '../profile/profile.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { replyMarkup } from './constants';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

@Injectable()
export class BotTelegramService {
  private reply_markup = replyMarkup;
  private idTransaction: string;
  private currentAction: string;
  private moneyReceive: string;
  private description: string;
  private idReceive: string;
  private readonly bot: any;

  constructor(
    private readonly transactionService: TransactionsService,
    private readonly accountsService: AccountsService,
    private readonly profileService: ProfileService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {
    this.bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
    this.bot.on('callback_query', this.handleCallbackQuery);
    this.bot.on('message', this.handleMessage);
  }

  handleMessage = async (msg: any) => {
    // console.log(msg);

    const options = {
      chat_id: msg.from.id,
      usernameTelegram: String(msg.chat.username),
      first_name: msg.from.first_name,
      text_hello: `Hi ${msg.from.first_name} ${msg.from.last_name}, I'm Panda.
      \nI was born to help you use Panda Wallet.
      \nLet me know how I can help you?`,
      text_error:
        "I don't understand what you mean. I can only help you with the following: ",
    };

    switch (true) {
      case msg.text.includes('/start'):
        return this.sendMessageToUser(options.chat_id, options.text_hello, {
          reply_markup: JSON.stringify(this.reply_markup),
        });

      case msg.reply_to_message &&
        msg.reply_to_message.message_id &&
        this.currentAction === 'deposit':
        const deposit = await this.accountsService.depositMoney(
          String(options.chat_id),
          msg.text,
        );
        if (
          !(typeof deposit === 'string') &&
          !isNaN(Number(msg.text)) &&
          Number(msg.text) > 0
        ) {
          const infoTransaction =
            await this.transactionService.createTransaction({
              sourceAccount: options.chat_id,
              destinationAccount: options.chat_id,
              description: 'deposit',
              amount: msg.text,
              type: 'deposit',
            });
          await this.sendMessageToUser(
            options.chat_id,
            `Deposit Successfully.\n Transaction ID: ${infoTransaction.id}`,
          );
        } else if (!isNaN(Number(msg.text)) || Number(msg.text) < 0) {
          await this.sendMessageToUser(options.chat_id, 'Invalid deposit ');
        } else {
          await this.sendMessageToUser(options.chat_id, 'Deposit Error', {
            reply_markup: JSON.stringify(this.reply_markup),
          });
        }
        await this.sendMessageToUser(
          options.chat_id,
          'What can I do for you next?',
          {
            reply_markup: JSON.stringify(this.reply_markup),
          },
        );
        this.currentAction = undefined;
        break;

      case msg.reply_to_message &&
        msg.reply_to_message.message_id &&
        this.currentAction === 'withdraw':
        const withdraw = await this.accountsService.withdrawMoney(
          String(options.chat_id),
          msg.text,
        );
        if (
          !(typeof withdraw === 'string') &&
          !isNaN(Number(msg.text)) &&
          Number(msg.text) > 0
        ) {
          const infoTransaction =
            await this.transactionService.createTransaction({
              sourceAccount: options.chat_id,
              destinationAccount: options.chat_id,
              description: 'withdraw',
              amount: msg.text,
              type: 'withdraw',
            });
          await this.sendMessageToUser(
            options.chat_id,
            `Withdraw Successfully.\n Transaction ID: ${infoTransaction.id}`,
          );
        } else if (!isNaN(Number(msg.text)) || Number(msg.text) < 0) {
          await this.sendMessageToUser(options.chat_id, 'Invalid withdraw ');
        } else {
          await this.sendMessageToUser(options.chat_id, 'Withdraw Error', {
            reply_markup: JSON.stringify(this.reply_markup),
          });
        }
        await this.sendMessageToUser(
          options.chat_id,
          'What can I do for you next?',
          {
            reply_markup: JSON.stringify(this.reply_markup),
          },
        );
        this.currentAction = undefined;
        break;

      case msg.reply_to_message &&
        msg.reply_to_message.message_id &&
        this.currentAction === 'transfer':
        if (
          this.idReceive === undefined &&
          this.moneyReceive === undefined &&
          this.description === undefined
        ) {
          this.idReceive = msg.text;
          await this.sendMessageToUser(
            options.chat_id,
            'Please enter the amount you want to transfer',
            {
              reply_markup: {
                force_reply: true,
              },
            },
          );
        } else if (
          this.idReceive !== undefined &&
          this.moneyReceive === undefined &&
          this.description === undefined
        ) {
          this.moneyReceive = msg.text;
          if (
            !isNaN(Number(msg.text)) &&
            Number(msg.text) > 0 &&
            !(String(options.chat_id) === String(this.idReceive))
          ) {
            await this.sendMessageToUser(
              options.chat_id,
              'Please enter a description for this transfer',
              {
                reply_markup: {
                  force_reply: true,
                },
              },
            );
          } else {
            await this.sendMessageToUser(
              options.chat_id,
              'Transfer Failed. Invalid receiving address or deposit amount',
            );
            await this.sendMessageToUser(
              options.chat_id,
              'What can I do for you next?',
              {
                reply_markup: JSON.stringify(this.reply_markup),
              },
            );
            this.idReceive = undefined;
            this.moneyReceive = undefined;
            this.currentAction = undefined;
          }
        } else {
          const description = msg.text;
          const transfer = await this.accountsService.transferMoney(
            String(options.chat_id),
            this.idReceive,
            this.moneyReceive,
          );
          if (transfer === 'Transfer Successfully') {
            const transaction = await this.transactionService.createTransaction(
              {
                sourceAccount: String(options.chat_id),
                destinationAccount: String(this.idReceive),
                description: description,
                amount: this.moneyReceive,
                type: 'transfer',
              },
            );
            if (transaction) {
              await this.sendMessageToUser(
                options.chat_id,
                `Transfer Successfully.\nTransaction ID: ${transaction.id}`,
              );
            } else {
              await this.sendMessageToUser(
                options.chat_id,
                'Transfer Failed. Invalid receiving address or deposit amount',
              );
            }
          } else {
            await this.sendMessageToUser(
              options.chat_id,
              'Transfer Failed. Invalid receiving address or deposit amount',
            );
          }
          await this.sendMessageToUser(
            options.chat_id,
            'What can I do for you next?',
            {
              reply_markup: JSON.stringify(this.reply_markup),
            },
          );
          this.description = undefined;
          this.idReceive = undefined;
          this.moneyReceive = undefined;
          this.currentAction = undefined;
        }

        break;

      case msg.reply_to_message &&
        msg.reply_to_message.message_id &&
        this.currentAction === 'transferUsername':
        if (
          this.idReceive === undefined &&
          this.moneyReceive === undefined &&
          this.description === undefined
        ) {
          this.idReceive = msg.text;
          await this.sendMessageToUser(
            options.chat_id,
            'Please enter the amount you want to transfer',
            {
              reply_markup: {
                force_reply: true,
              },
            },
          );
        } else if (
          this.idReceive !== undefined &&
          this.moneyReceive === undefined &&
          this.description === undefined
        ) {
          this.moneyReceive = msg.text;
          if (
            !isNaN(Number(msg.text)) &&
            Number(msg.text) > 0 &&
            !(String(options.chat_id) === String(this.idReceive))
          ) {
            await this.sendMessageToUser(
              options.chat_id,
              'Please enter a description for this transfer',
              {
                reply_markup: {
                  force_reply: true,
                },
              },
            );
          } else {
            await this.sendMessageToUser(
              options.chat_id,
              'Transfer Failed. Invalid receiving address or deposit amount',
            );
            await this.sendMessageToUser(
              options.chat_id,
              'What can I do for you next?',
              {
                reply_markup: JSON.stringify(this.reply_markup),
              },
            );
            this.idReceive = undefined;
            this.moneyReceive = undefined;
            this.currentAction = undefined;
          }
        } else {
          const description = msg.text;
          const transferUsername =
            await this.accountsService.transferUsernameTelegram(
              String(options.chat_id),
              this.idReceive,
              this.moneyReceive,
            );
          if (transferUsername === 'Transfer Successfully') {
            const transaction =
              await this.transactionService.createTransactionUsername({
                sourceAccount: String(options.chat_id),
                destinationAccount: String(this.idReceive),
                description: description,
                amount: this.moneyReceive,
                type: 'transferUsername',
              });
            if (transaction) {
              await this.sendMessageToUser(
                options.chat_id,
                `Transfer Successfully.\nTransaction ID: ${transaction.id}`,
              );
            } else {
              await this.sendMessageToUser(
                options.chat_id,
                'Transfer Failed. Invalid receiving address or deposit amount',
              );
            }
          } else {
            await this.sendMessageToUser(
              options.chat_id,
              'Transfer Failed. Invalid receiving address or deposit amount',
            );
          }
          await this.sendMessageToUser(
            options.chat_id,
            'What can I do for you next?',
            {
              reply_markup: JSON.stringify(this.reply_markup),
            },
          );
          this.description = undefined;
          this.idReceive = undefined;
          this.moneyReceive = undefined;
          this.currentAction = undefined;
        }

        break;

      case msg.reply_to_message &&
        msg.reply_to_message.message_id &&
        this.currentAction === 'history':
        this.idTransaction = msg.text;
        try {
          const history = await this.transactionService.getOneTransactionById(
            this.idTransaction,
          );
          if (typeof history !== 'string') {
            if (
              String(options.chat_id) === history?.sourceAccount ||
              String(options.chat_id) === history?.destinationAccount
            ) {
              await this.sendMessageToUser(
                options.chat_id,
                `Transaction Id:\n ${history?.id}\n 
                        Amount: ${history?.amount}\n 
                        Description: ${history?.description}\n 
                        Type: ${history?.type}\n 
                        Source Account: ${
                          history?.type === 'deposit'
                            ? ''
                            : history?.sourceAccount
                        }\n 
                        Destination Account: ${
                          history?.type === 'withdraw'
                            ? ''
                            : history?.destinationAccount
                        }`,
              );
            } else {
              await this.sendMessageToUser(
                options.chat_id,
                `Sorry, this transaction doesn't belong to you`,
              );
            }
          } else {
            await this.sendMessageToUser(
              options.chat_id,
              `Transaction not found`,
            );
          }
        } catch (e) {
          await this.sendMessageToUser(
            options.chat_id,
            `Transaction not found`,
          );
        }

        await this.sendMessageToUser(
          options.chat_id,
          'What can I do for you next?',
          {
            reply_markup: JSON.stringify(this.reply_markup),
          },
        );
        this.idTransaction = undefined;
        this.currentAction = undefined;
        break;

      default:
        await this.sendMessageToUser(options.chat_id, options.text_error, {
          reply_markup: JSON.stringify(this.reply_markup),
        });
        break;
    }
  };

  handleCallbackQuery = async (query: any) => {
    console.log(query);

    const options = {
      user_id: String(query.from.id),
      chat_id: query.message.chat.id,
      usernameTelegram: String(query.message.chat.username),
      first_name: query.message.chat.first_name,
      text_error:
        "I don't understand what you mean. I can only help you with the following: ",
    };

    switch (true) {
      case query.data.includes('checking'):
        const checkUser = await this.checkUser(options.user_id);
        if (checkUser) {
          const checking = await this.accountsService.checkingBalance(
            options.user_id,
          );
          if (typeof checking === 'string') {
            await this.sendMessageToUser(
              options.chat_id,
              'User not found. Unable to check balance. Please click to "Register" to create a User',
              {
                reply_markup: JSON.stringify(this.reply_markup),
              },
            );
          } else {
            await this.sendMessageToUser(
              options.chat_id,
              // `Your account ${checking.accountNumber} currently has a balance of ${checking.balance}`,
              `Your account balance is ${checking.balance}`,
            );
            await this.sendMessageToUser(
              options.chat_id,
              'What can I do for you next?',
              {
                reply_markup: JSON.stringify(this.reply_markup),
              },
            );
          }
        } else {
          await this.registerUser(
            options.user_id,
            options.user_id,
            options.usernameTelegram,
          );
          await this.accountsService.handleBackup(
            options.user_id,
            options.usernameTelegram,
          );
          const checking = await this.accountsService.checkingBalance(
            options.user_id,
          );
          if (typeof checking === 'string') {
            await this.sendMessageToUser(
              options.chat_id,
              'User not found. Unable to check balance. Please click to "Register" to create a User',
              {
                reply_markup: JSON.stringify(this.reply_markup),
              },
            );
          } else {
            await this.sendMessageToUser(
              options.chat_id,
              `Your account ${checking.accountNumber} currently has a balance of ${checking.balance}`,
            );
          }
        }
        break;

      case query.data.includes('deposit'):
        if (await this.checkUser(options.user_id)) {
          this.currentAction = 'deposit';
          return this.sendMessageToUser(
            options.chat_id,
            'How much do you want to deposit?',
            {
              reply_markup: {
                force_reply: true,
              },
            },
          );
        } else {
          await this.registerUser(
            options.user_id,
            options.user_id,
            options.usernameTelegram,
          );
          await this.accountsService.handleBackup(
            options.user_id,
            options.usernameTelegram,
          );
          this.currentAction = 'deposit';
          return this.sendMessageToUser(
            options.chat_id,
            'How much do you want to deposit?',
            {
              reply_markup: {
                force_reply: true,
              },
            },
          );
        }

      case query.data === 'transfer':
        if (await this.checkUser(options.user_id)) {
          this.currentAction = 'transfer';
          return this.sendMessageToUser(
            options.chat_id,
            'Which id do you want to go to?',
            {
              reply_markup: {
                force_reply: true,
              },
            },
          );
        } else {
          await this.registerUser(
            options.user_id,
            options.user_id,
            options.usernameTelegram,
          );
          await this.accountsService.handleBackup(
            options.user_id,
            options.usernameTelegram,
          );
          this.currentAction = 'transfer';
          return this.sendMessageToUser(
            options.chat_id,
            'Which id do you want to go to?',
            {
              reply_markup: {
                force_reply: true,
              },
            },
          );
        }

      case query.data.includes('withdraw'):
        if (await this.checkUser(options.user_id)) {
          this.currentAction = 'withdraw';
          return this.sendMessageToUser(
            options.chat_id,
            'How much do you want to withdraw?',
            {
              reply_markup: {
                force_reply: true,
              },
            },
          );
        } else {
          await this.registerUser(
            options.user_id,
            options.user_id,
            options.usernameTelegram,
          );
          await this.accountsService.handleBackup(
            options.user_id,
            options.usernameTelegram,
          );
          this.currentAction = 'withdraw';
          return this.sendMessageToUser(
            options.chat_id,
            'How much do you want to withdraw?',
            {
              reply_markup: {
                force_reply: true,
              },
            },
          );
        }

      case query.data.includes('history'):
        if (await this.checkUser(options.user_id)) {
          this.currentAction = 'history';
          return this.sendMessageToUser(
            options.chat_id,
            'let me know the transaction id you want to check',
            {
              reply_markup: {
                force_reply: true,
              },
            },
          );
        } else {
          await this.registerUser(
            options.user_id,
            options.user_id,
            options.usernameTelegram,
          );
          await this.accountsService.handleBackup(
            options.user_id,
            options.usernameTelegram,
          );
          this.currentAction = 'history';
          return this.sendMessageToUser(
            options.chat_id,
            'let me know the transaction id you want to check',
            {
              reply_markup: {
                force_reply: true,
              },
            },
          );
        }

      case query.data === 'transferUsername':
        if (await this.checkUsernameTelegram(options.usernameTelegram)) {
          this.currentAction = 'transferUsername';
          return this.sendMessageToUser(
            options.chat_id,
            'Which username do you want to go to?',
            {
              reply_markup: {
                force_reply: true,
              },
            },
          );
        } else {
          await this.registerUser(
            options.user_id,
            options.user_id,
            options.usernameTelegram,
          );
          await this.accountsService.handleBackup(
            options.user_id,
            options.usernameTelegram,
          );
          this.currentAction = 'transferUsername';
          return this.sendMessageToUser(
            options.chat_id,
            'Which username do you want to go to?',
            {
              reply_markup: {
                force_reply: true,
              },
            },
          );
        }

      // case query.data.includes('support'):
      //   return this.sendMessageToUser(
      //     options.chat_id,
      //     'Feature Support is under development please wait for the next version ',
      //   );
      // case query.data.includes('security'):
      //   return this.sendMessageToUser(
      //     options.chat_id,
      //     'Feature Security is under development please wait for the next version ',
      //   );
      // case query.data.includes('register'):
      //   const password = await this.hashId(options.user_id);
      //
      //   const checkUser = await this.userService.findOneByUsername(
      //     options.user_id,
      //   );
      //   if (!checkUser) {
      //     await this.authService.register({
      //       username: options.user_id,
      //       password: password,
      //     });
      //     await this.profileService.createProfile(options.user_id, {
      //       email: '',
      //       firstName: '',
      //       lastName: '',
      //       age: '',
      //       gender: '',
      //       address: '',
      //     });
      //     await this.accountsService.createAccount(options.user_id, {
      //       accountNumber: '1',
      //       balance: '0',
      //     });
      //     await this.sendMessageToUser(
      //       options.chat_id,
      //       'Register Successfully',
      //     );
      //   } else {
      //     await this.sendMessageToUser(
      //       options.chat_id,
      //       'Registration Failed. User already exists',
      //       {
      //         reply_markup: JSON.stringify(this.reply_markup),
      //       },
      //     );
      //   }
      //   break;

      default:
        return this.sendMessageToUser(
          options.chat_id,
          options.text_error,
          query.message.reply_markup,
        );
    }
  };

  sendMessageToUser = async (userId: number, message: string, option?: any) => {
    return await this.bot.sendMessage(String(userId), message, option);
  };

  checkUser = async (username: string) => {
    const user = await this.userService.findOneByUsername(username);
    return !!user;
  };

  checkUsernameTelegram = async (usernameTelegram: string) => {
    const user = await this.userService.findOneByUsernameTelegram(
      usernameTelegram,
    );
    return !!user;
  };

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
}
