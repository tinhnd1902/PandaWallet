import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column()
  sourceAccount: string;

  @Column()
  destinationAccount: string;
}
