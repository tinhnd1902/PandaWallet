export const replyMarkup = {
  inline_keyboard: [
    [
      {
        text: 'Checking Balance',
        callback_data: 'checking',
      },
    ],
    [
      {
        text: 'Deposit',
        callback_data: 'deposit',
      },
      {
        text: 'Withdraw',
        callback_data: 'withdraw',
      },
    ],
    [
      {
        text: 'Transfer ID',
        callback_data: 'transfer',
      },
      {
        text: 'Transfer Username',
        callback_data: 'transferUsername',
      },
    ],
    [
      {
        text: 'Transaction History',
        callback_data: 'history',
      },
    ],
  ],
};
