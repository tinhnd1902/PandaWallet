export const replyMarkup = {
  inline_keyboard: [
    [
      {
        text: `Create account`,
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
        text: 'Transaction history',
        callback_data: 'history',
      },
    ],
    [
      {
        text: 'Customer support',
        callback_data: 'support',
      },
      {
        text: 'Information security',
        callback_data: 'security',
      },
    ],
  ],
};
