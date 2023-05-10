import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Account } from '../../accounts/entities/account.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column()
  type: string;

  @ManyToOne(() => Account, (account) => account.sourceTransactions)
  sourceAccount: Account;

  @ManyToOne(() => Account, (account) => account.destinationTransactions)
  destinationAccount: Account;
}
