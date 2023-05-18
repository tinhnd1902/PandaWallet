import { Post, Body, Param, Delete, Controller } from '@nestjs/common';

import { CreateBackupDto } from './dto/create-backup.dto';
import { BackupService } from './backup.service';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post()
  create(@Body() createBackupDto: CreateBackupDto) {
    return this.backupService.create(createBackupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.backupService.remove(+id);
  }
}
