import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './module/users/entities/user.entity';
import { Account } from './module/accounts/entities/account.entity';
import { Transaction } from './module/transations/entities/transation.entity';
export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'panda_wallet',
  entities: [User, Account, Transaction],
  synchronize: true,
};
