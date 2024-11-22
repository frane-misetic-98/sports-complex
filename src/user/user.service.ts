import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`create(createUserDto : ${JSON.stringify(createUserDto)})`);

    if (await this.findByUsername(createUserDto.username)) {
      const message = `User with username ${createUserDto.username} already exists`;

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    const user = this.userRepository.create({
      firstName: createUserDto.username,
      lastName: createUserDto.lastName,
      username: createUserDto.username,
    });

    await user.setPassword(createUserDto.password);

    return await this.userRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    this.logger.log(`findByUsername(username : ${username})`);

    return this.userRepository.findOne({ where: { username } });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
