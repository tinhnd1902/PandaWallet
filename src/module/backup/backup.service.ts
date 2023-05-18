import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateBackupDto } from './dto/create-backup.dto';
import { Backup } from './entities/backup.entity';

@Injectable()
export class BackupService {
  constructor(
    @InjectRepository(Backup) private backupRepository: Repository<Backup>,
  ) {}

  async create(createBackupDto: CreateBackupDto) {
    const checkBackup = await this.backupRepository.findOne({
      where: {
        userTelegram: createBackupDto.userTelegram,
      },
    });
    if (checkBackup) {
      await this.backupRepository.update(checkBackup.id, {
        ...createBackupDto,
        backupBalance: String(
          Number(checkBackup.backupBalance) +
            Number(createBackupDto.backupBalance),
        ),
      });
    } else {
      const createBackup = await this.backupRepository.create({
        ...createBackupDto,
        createdAt: new Date(),
      });
      return await this.backupRepository.save(createBackup);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} backup`;
  }
}
