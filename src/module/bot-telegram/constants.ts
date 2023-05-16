export const replyMarkup = {
  inline_keyboard: [
    [
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
        text: 'Withdraw money',
        callback_data: 'withdraw',
      },
    ],
    [
      {
        text: 'Transfer money',
        callback_data: 'transfer',
      },
      {
        text: 'Transaction Retrieval',
        callback_data: 'history',
      },
    ],
    // [
    //   {
    //     text: 'Register to Telegram',
    //     callback_data: 'register',
    //   },
    // ],
  ],
};
