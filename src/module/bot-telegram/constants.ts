export const replyMarkup = {
  inline_keyboard: [
    [
      {
        text: `Register user new`,
        callback_data: 'create',
      },
      {
        text: 'Checking balance',
        callback_data: 'checking',
      },
    ],
    [
      {
        text: 'Deposit money',
        callback_data: 'deposit',
      },
      {
        text: 'Transfer money',
        callback_data: 'transfer',
      },
    ],
    [
      {
        text: 'Withdraw money',
        callback_data: 'withdraw',
      },
      {
        text: 'Transaction Retrieval',
        callback_data: 'history',
      },
    ],
    [
      {
        text: 'Register to Telegram',
        callback_data: 'register',
      },
    ],
  ],
};
