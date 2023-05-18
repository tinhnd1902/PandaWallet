import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('backup')
export class Backup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userTelegram: string;

  @Column({ nullable: true })
  backupBalance: string;

  @Column({ nullable: true })
  sourceAccount: string;

  @Column()
  createdAt: Date;
}
