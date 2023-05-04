import { Injectable } from '@nestjs/common';
import { CreateTransationDto } from './dto/create-transation.dto';
import { UpdateTransationDto } from './dto/update-transation.dto';

@Injectable()
export class TransationsService {
  create(createTransationDto: CreateTransationDto) {
    return 'This action adds a new transation';
  }

  findAll() {
    return `This action returns all transations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transation`;
  }

  update(id: number, updateTransationDto: UpdateTransationDto) {
    return `This action updates a #${id} transation`;
  }

  remove(id: number) {
    return `This action removes a #${id} transation`;
  }
}
