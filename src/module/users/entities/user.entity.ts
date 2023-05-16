import {
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
  Entity,
  Column,
  Unique,
} from 'typeorm';

import { Transaction } from '../../transations/entities/transation.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Profile } from '../../profile/entities/profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @Unique(['username'])
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column()
  createAt: Date;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @OneToMany(() => Transaction, (transaction) => transaction.sourceAccount)
  sourceTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.destinationAccount)
  destinationTransactions: Transaction[];
}
