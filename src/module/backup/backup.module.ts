import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Backup } from './entities/backup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Backup])],
  controllers: [BackupController],
  providers: [BackupService],
  exports: [BackupService],
})
export class BackupModule {}
