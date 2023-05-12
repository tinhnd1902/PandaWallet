import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

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
}
