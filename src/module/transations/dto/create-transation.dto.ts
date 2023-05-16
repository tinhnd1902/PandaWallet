export class CreateTransactionDto {
  destinationAccount: string;
  sourceAccount: string;
  description: string;
  amount: string;
  type: string;
}
