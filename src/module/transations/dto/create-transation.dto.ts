export class CreateTransactionDto {
  description: string;
  sourceAccount: string;
  destinationAccount: string;
  type: string;
  amount: string;
}
