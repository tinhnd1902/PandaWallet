import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Transaction } from './module/transations/entities/transation.entity';
import { Account } from './module/accounts/entities/account.entity';
import { Profile } from './module/profile/entities/profile.entity';
import { Backup } from './module/backup/entities/backup.entity';
import { User } from './module/users/entities/user.entity';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'panda_wallet',
  entities: [User, Profile, Account, Transaction, Backup],
  synchronize: true,
};
