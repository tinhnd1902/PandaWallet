import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { replyMarkup } from './constants';
import * as dotenv from 'dotenv';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

@Injectable()
export class BotTelegramService {
  private readonly bot: any;
  private logger = new Logger(BotTelegramService.name);
  private currentUserId: number;
  private currentAction: string;
  private username: string;
  private password: string;
  private reply_markup = replyMarkup;
  constructor() {
    this.bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
    this.bot.on('message', this.handleMessage);
    this.bot.on('callback_query', this.handleCallbackQuery);
  }

  handleMessage = (msg: any) => {
    // this.logger.debug(msg);

    const options = {
      chat_id: msg.from.id,
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
        this.currentUserId !== undefined:
        this.logger.debug(this.username, this.password);
        if (this.username === undefined && this.password === undefined) {
          this.username = msg.text;
          this.sendMessageToUser(
            this.currentUserId,
            'Let me know the "PASSWORD" you want?',
            {
              reply_markup: {
                force_reply: true,
              },
            },
          );
        } else {
          this.password = msg.text;
          this.sendMessageToUser(
            this.currentUserId,
            'Create account successfully.',
          );
          this.currentUserId = undefined;
          this.currentAction = undefined;
        }
        break;

      default:
        return this.sendMessageToUser(options.chat_id, options.text_error, {
          reply_markup: JSON.stringify(this.reply_markup),
        });
    }
  };

  handleCallbackQuery = (query: any) => {
    // this.logger.debug(query);

    const options = {
      chat_id: query.message.chat.id,
      first_name: query.message.chat.first_name,
      text_error:
        "I don't understand what you mean. I can only help you with the following: ",
    };

    switch (true) {
      case query.data.includes('create'):
        this.currentUserId = options.chat_id;
        this.currentAction = 'create';
        return this.sendMessageToUser(
          options.chat_id,
          'Let me know the "USERNAME" you want',
          {
            reply_markup: {
              force_reply: true,
            },
          },
        );
      case query.data.includes('checking'):
        return this.sendMessageToUser(
          options.chat_id,
          'Feature Checking is under development please wait for the next version ',
        );
      case query.data.includes('deposit'):
        return this.sendMessageToUser(
          options.chat_id,
          'Feature Deposit is under development please wait for the next version ',
        );
      case query.data.includes('transfer'):
        return this.sendMessageToUser(
          options.chat_id,
          'Feature Transfer is under development please wait for the next version ',
        );
      case query.data.includes('withdraw'):
        return this.sendMessageToUser(
          options.chat_id,
          'Feature Withdraw is under development please wait for the next version ',
        );
      case query.data.includes('history'):
        return this.sendMessageToUser(
          options.chat_id,
          'Feature History is under development please wait for the next version ',
        );
      case query.data.includes('support'):
        return this.sendMessageToUser(
          options.chat_id,
          'Feature Support is under development please wait for the next version ',
        );
      case query.data.includes('security'):
        return this.sendMessageToUser(
          options.chat_id,
          'Feature Security is under development please wait for the next version ',
        );
      default:
        return this.sendMessageToUser(
          options.chat_id,
          options.text_error,
          query.message.reply_markup,
        );
    }
  };

  sendMessageToUser = (userId: number, message: string, option?: any) => {
    return this.bot.sendMessage(String(userId), message, option);
  };
}
