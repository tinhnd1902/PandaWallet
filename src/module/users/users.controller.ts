import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { uuid } from 'uuidv4';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getList() {
    console.log('kakaka');
    return this.userService.findAll();
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    console.log('lalalalal');
    return this.userService.remove(id);
  }
}
