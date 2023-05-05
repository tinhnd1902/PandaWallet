import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: string;

  @Column()
  gender: string;

  @Column()
  address: string;

  @Column()
  createAt: Date;
}
