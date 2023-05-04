import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransationsService } from './transations.service';
import { CreateTransationDto } from './dto/create-transation.dto';
import { UpdateTransationDto } from './dto/update-transation.dto';

@Controller('transations')
export class TransationsController {
  constructor(private readonly transationsService: TransationsService) {}

  @Post()
  create(@Body() createTransationDto: CreateTransationDto) {
    return this.transationsService.create(createTransationDto);
  }

  @Get()
  findAll() {
    return this.transationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransationDto: UpdateTransationDto) {
    return this.transationsService.update(+id, updateTransationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transationsService.remove(+id);
  }
}
