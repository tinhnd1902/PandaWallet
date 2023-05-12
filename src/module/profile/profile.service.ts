import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../users/entities/user.entity';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  //Create a new profile based on the information provided.
  async createProfile(username: string, createProfileDto: CreateProfileDto) {
    const user = await this.userRepository.findOneBy({
      username: username,
    });
    if (user) {
      const newProfile = this.profileRepository.create({
        ...createProfileDto,
        createAt: new Date(),
      });

      user.profile = await this.profileRepository.save(newProfile);
      await this.userRepository.save(user);

      return await this.userRepository.findOne({
        where: { username: username },
        relations: ['profile'],
      });
    }

    throw new HttpException(
      'User Not Found. Cannot create Profile',
      HttpStatus.BAD_REQUEST,
    );
  }

  //Get profile information based on ID
  async getProfileById(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id: id },
    });
    if (!profile) {
      throw new HttpException(
        `Profile with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return profile;
  }

  //Update profile information based on ID
  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.getProfileById(id);
    const updatedProfile = { ...profile, ...updateProfileDto };
    return await this.profileRepository.save(updatedProfile);
  }

  //Delete profiles based on ID
  async deleteProfile(id: string): Promise<void> {
    const profile = await this.getProfileById(id);
    await this.profileRepository.delete(profile.id);
  }
}
