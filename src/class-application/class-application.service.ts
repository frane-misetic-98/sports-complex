import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassApplicationDto } from './dto/create-class-application.dto';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { ClassApplication } from './entities/class-application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SportsClassService } from '../sports-class/sports-class.service';
import { JwtPayload } from '../common/jwt-payload';
import { ApplicationStatus, UserRole } from '../enums';

@Injectable()
export class ClassApplicationService {
  private readonly logger = new Logger(ClassApplicationService.name);

  constructor(
    @InjectRepository(ClassApplication)
    private readonly classApplicationRepository: Repository<ClassApplication>,
    private readonly userService: UserService,
    private readonly sportsClassService: SportsClassService,
  ) {}

  async findAll(): Promise<ClassApplication[]> {
    this.logger.log(`findAll()`);

    return await this.classApplicationRepository.find({
      relations: ['sportsClass', 'sportsClass.admin', 'user'],
    });
  }

  async findOneById(
    id: string,
    reqUser: JwtPayload,
  ): Promise<ClassApplication> {
    this.logger.log(`findOneById( id : ${id} ), reqUser: ${reqUser.username}`);

    const application = await this.classApplicationRepository.findOne({
      where: { id },
      relations: ['user', 'sportsClass', 'sportsClass.admin'],
    });

    if (!application) {
      const message = `Application with id ${id} not found`;

      this.logger.error(message);

      throw new NotFoundException(message);
    }

    if (reqUser.role === UserRole.USER && reqUser.id !== application.user.id) {
      const message = `Can not view applications of other users`;

      this.logger.error(message);

      throw new ForbiddenException(message);
    }

    if (
      reqUser.role === UserRole.ADMIN &&
      reqUser.id !== application.sportsClass.admin.id
    ) {
      const message = `Can not view or modify applications for other classes`;

      this.logger.error(message);

      throw new ForbiddenException(message);
    }

    return application;
  }

  async create(
    createClassApplicationDto: CreateClassApplicationDto,
    reqUser: JwtPayload,
  ): Promise<void> {
    const user = await this.userService.findById(reqUser.id);

    const sportsClass = await this.sportsClassService.findById(
      createClassApplicationDto.sportsClassId,
    );

    const attendees = await this.sportsClassService.findAttendees(
      createClassApplicationDto.sportsClassId,
      reqUser,
    );

    if (attendees.some((x) => x.id === user.id)) {
      const message = 'You already attend this class';

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    const application = this.classApplicationRepository.create({
      user,
      sportsClass,
      status: ApplicationStatus.PENDING,
    });

    await this.classApplicationRepository.save(application);
  }

  async performAction(
    id: string,
    newStatus: ApplicationStatus.ACCEPTED | ApplicationStatus.REJECTED,
    reqUser: JwtPayload,
  ): Promise<void> {
    this.logger.log(
      `performAction( id : ${id}, action: ${newStatus}, reqUser: ${reqUser.username} )`,
    );

    const application = await this.findOneById(id, reqUser);

    if (newStatus === ApplicationStatus.ACCEPTED) {
      await this.sportsClassService.addAttendee(
        application.sportsClass.id,
        application.user.id,
        reqUser,
      );
    }

    await this.classApplicationRepository.update(id, { status: newStatus });
  }

  async delete(id: string, reqUser: JwtPayload): Promise<void> {
    this.logger.log(`delete( id : ${id} , reqUser: ${reqUser.username} )`);

    await this.findOneById(id, reqUser);

    await this.classApplicationRepository.delete(id);
  }
}
