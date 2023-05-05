import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const checkUser = this.userRepository.findOneBy({
      username: createUserDto.username,
    });
    if (checkUser) {
      const newUser = this.userRepository.create({
        ...createUserDto,
        createAt: new Date(),
      });
      return this.userRepository.save(newUser);
    }
    return 'User already exists';
  }

  findAll() {
    return this.userRepository.find({
      relations: ['accounts', 'sourceTransactions', 'destinationTransactions'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOneBy({
      id: id,
    });
  }

  async remove(id: string) {
    await this.userRepository.delete(id);
    return this.userRepository.find();
  }

  findOneByUsername(username: string) {
    return this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }
}
