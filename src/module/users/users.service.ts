import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Account } from '../accounts/entities/account.entity';
import { Profile } from '../profile/entities/profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  //Create a new user with the provided information
  async createUser(createUserDto: CreateUserDto) {
    const checkUser = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });
    if (!checkUser) {
      const newUser = await this.userRepository.create({
        ...createUserDto,
        createAt: new Date(),
      });
      await this.userRepository.save(newUser);
      return await this.userRepository.find({
        where: { username: createUserDto.username },
        relations: ['profile', 'accounts'],
      });
    }
    return 'User already exists';
  }

  //Get information of all users
  findAll() {
    return this.userRepository.find({
      relations: ['accounts', 'sourceTransactions', 'destinationTransactions'],
    });
  }

  //Get user information based on username
  findOneByUsername(username: string) {
    return this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  //Get user information based on ID
  findOneById(id: string) {
    return this.userRepository.find({
      where: { id: id },
      relations: ['profile', 'accounts'],
    });
  }

  //Delete users based on ID
  async remove(id: string) {
    const user = await this.userRepository.find({
      where: { id: id },
      relations: ['profile', 'accounts'],
    });
    if (user) {
      await this.accountsRepository.delete(user[0].accounts[0].id);
      await this.userRepository.delete(id);
      await this.profileRepository.delete(user[0].profile.id);
    }
    return this.userRepository.find();
  }

  //Add new account for specified user
  async addAccountToUser(
    userId: string,
    accountNumber: string,
    balance: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const newAccount = new Account();
    newAccount.accountNumber = accountNumber;
    newAccount.balance = balance;
    newAccount.createAt = new Date();
    newAccount.user = user;

    await this.accountsRepository.save(newAccount);
  }

  //Get a list of user accounts based on ID
  async getUserAccounts(userId: string): Promise<Account[]> {
    return await this.accountsRepository.find({
      where: { user: { id: userId } },
      order: { createAt: 'ASC' },
    });
  }

  //Update user information based on ID
  async updateUser(id: string, userDto: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (userDto.username) {
      user.username = userDto.username;
    }

    if (userDto.password) {
      user.password = userDto.password;
    }

    // // Update profile if provided
    // if (userDto.profile) {
    //   const { firstName, lastName, age, gender, address } = userDto.profile;
    //   const profile = await this.profileRepository.findOne(user.profile.id);
    //   profile.firstName = firstName || profile.firstName;
    //   profile.lastName = lastName || profile.lastName;
    //   profile.age = age || profile.age;
    //   profile.gender = gender || profile.gender;
    //   profile.address = address || profile.address;
    //   await this.profileRepository.save(profile);
    // }

    return await this.userRepository.save(user);
  }
}
