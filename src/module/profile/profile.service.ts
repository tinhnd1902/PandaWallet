import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async createUserProfileDto(id: string, CreateProfileDto: CreateProfileDto) {
    const user = await this.userRepository.findOneBy({
      id: id,
    });
    if (!user)
      throw new HttpException(
        'User Not Found. Cannot create Profile',
        HttpStatus.BAD_REQUEST,
      );
    const newUserProfile = this.profileRepository.create({
      ...CreateProfileDto,
      createAt: new Date(),
    });
    user.profile = await this.profileRepository.save(newUserProfile);
    await this.userRepository.save(user);
    return await this.userRepository.find({
      where: { id: id },
      relations: ['profile'],
    });
  }
}
