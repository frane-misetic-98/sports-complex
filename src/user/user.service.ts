import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterRequestDto } from '../authentication/dto/request/register-request.dto';
import { UserRole } from '../enums';
import { JwtPayload } from '../common/jwt-payload';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    this.logger.log(`findById(id : ${id})`);

    await this.validateUserExists(id);

    return await this.userRepository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<User | null> {
    this.logger.log(`findByUsername(username : ${username})`);

    return await this.userRepository.findOneBy({ username });
  }

  async create(registerDto: RegisterRequestDto): Promise<User> {
    this.logger.log(`create(registerDto : ${JSON.stringify(registerDto)})`);

    if (await this.findByUsername(registerDto.username)) {
      const message = `User with username ${registerDto.username} already exists`;

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    const user = this.userRepository.create({
      firstName: registerDto.username,
      lastName: registerDto.lastName,
      username: registerDto.username,
    });

    await user.setPassword(registerDto.password);

    return await this.userRepository.save(user);
  }

  async grantAdminPrivileges(id: string): Promise<void> {
    const user = await this.findById(id);

    if (user.role !== UserRole.USER) {
      const message = `User with role ${user.role} can not be granted admin privileges`;

      this.logger.error(`grantAdminPrivileges : ${id}` + message);

      throw new BadRequestException(message);
    }

    await this.userRepository.update(id, { role: UserRole.ADMIN });
  }

  async revokeAdminPrivileges(id: string, reqUser: JwtPayload): Promise<void> {
    if (reqUser.id === id) {
      const message = 'Can not modify own privileges';
      this.logger.error(`revokeAdminPrivileges : ${id} ` + message);

      throw new BadRequestException(message);
    }

    const user = await this.findById(id);

    if (user.role !== UserRole.ADMIN) {
      const message = `User with role ${user.role} can not have admin privileges revoked`;

      this.logger.error(`revokeAdminPrivileges : ${id}` + message);

      throw new BadRequestException(message);
    }

    await this.userRepository.update(id, { role: UserRole.USER });
  }

  async findAll(): Promise<User[]> {
    this.logger.log(`findAll()`);

    return await this.userRepository.find();
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`removeById(id : ${id})`);

    await this.validateUserExists(id);

    await this.userRepository.delete(id);
  }

  private async validateUserExists(id: string): Promise<void> {
    if (!(await this.userRepository.exists({ where: { id } }))) {
      const message = `User with id ${id} not found`;

      this.logger.error(message);

      throw new NotFoundException(message);
    }
  }
}
