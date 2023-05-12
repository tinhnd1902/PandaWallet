import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountNumber: string;

  @Column()
  balance: string;

  @Column()
  createAt: Date;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  // @OneToMany(() => Transaction, (transaction) => transaction.sourceAccount)
  // sourceTransactions: Transaction[];
  //
  // @OneToMany(() => Transaction, (transaction) => transaction.destinationAccount)
  // destinationTransactions: Transaction[];
}
