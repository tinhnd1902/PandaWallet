import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Transaction } from '../../transations/entities/transation.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountNumber: string;

  @Column()
  balance: number;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.sourceAccount)
  sourceTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.destinationAccount)
  destinationTransactions: Transaction[];
}
