import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSportsClassDto } from './dto/create-sports-class.dto';
import { UpdateSportsClassDto } from './dto/update-sports-class.dto';
import { In, Repository } from 'typeorm';
import { SportsClass } from './entities/sports-class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '../common/jwt-payload';
import { UserService } from '../user/user.service';
import { UserRole } from '../enums';
import { User } from '../user/entities/user.entity';
import { AssignAdminDto } from './dto/assign-admin.dto';
import { ClassSchedule } from './entities/class-schedule.entity';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';
import { SportsQueryDto } from './dto/sports-query.dto';

@Injectable()
export class SportsClassService {
  private readonly logger = new Logger(SportsClassService.name);

  constructor(
    @InjectRepository(SportsClass)
    private readonly sportsClassRepository: Repository<SportsClass>,
    @InjectRepository(ClassSchedule)
    private readonly classScheduleRepository: Repository<ClassSchedule>,
    private readonly userService: UserService,
  ) {}

  async create(
    createSportsClassDto: CreateSportsClassDto,
    reqUser: JwtPayload,
  ): Promise<void> {
    this.logger.log(
      `create(createSportsClassDto : ${JSON.stringify(createSportsClassDto)})`,
    );

    let user: User;
    if (createSportsClassDto.adminId) {
      user = await this.userService.findById(createSportsClassDto.adminId);

      if (user.role !== UserRole.ADMIN) {
        const message = `User with id ${user.id} is not admin`;

        this.logger.error(message);

        throw new BadRequestException(message);
      }
    } else {
      user = await this.userService.findById(reqUser.id);
    }

    const sportsClass = this.sportsClassRepository.create({
      ...createSportsClassDto,
      admin: user,
    });

    await this.sportsClassRepository.save(sportsClass);
  }

  async findAll(sportsQuery: SportsQueryDto): Promise<SportsClass[]> {
    this.logger.log(`findAll(sports : ${JSON.stringify(sportsQuery)})`);

    return sportsQuery.sports && sportsQuery.sports.length
      ? await this.sportsClassRepository.find({
          where: { sport: In(sportsQuery.sports) },
        })
      : await this.sportsClassRepository.find();
  }

  async findById(id: string): Promise<SportsClass> {
    this.logger.log(`findOne( id : ${id} )`);

    await this.validateSportsClassExists(id);

    return await this.sportsClassRepository.findOne({
      where: { id },
      relations: ['schedule', 'admin'],
    });
  }

  async findAttendees(classId: string, reqUser: JwtPayload): Promise<User[]> {
    this.logger.log(`findAttendees( id : ${classId} )`);

    const sportsClass = await this.findClassWithAttendees(classId, reqUser);

    return sportsClass.attendees;
  }

  async addAttendee(
    classId: string,
    userId: string,
    reqUser: JwtPayload,
  ): Promise<void> {
    this.logger.log(
      `addAttendee( classId : ${classId}, userId : ${userId} , reqUser: ${reqUser.username})`,
    );

    const sportsClass = await this.findClassWithAttendees(classId, reqUser);

    const user = await this.userService.findById(userId);

    sportsClass.attendees = sportsClass.attendees.concat(user);

    await this.sportsClassRepository.save(sportsClass);
  }

  async update(
    id: string,
    updateSportsClassDto: UpdateSportsClassDto,
    reqUser: JwtPayload,
  ): Promise<void> {
    this.logger.log(
      `update(updateSportsClassDto: ${JSON.stringify(updateSportsClassDto)}) , reqUser: ${reqUser.username} )`,
    );

    const sportsClass = await this.findById(id);

    this.validateAdmin(reqUser, sportsClass.admin);

    await this.sportsClassRepository.update(id, updateSportsClassDto);
  }

  async assignAdmin(
    classId: string,
    assignAdminDto: AssignAdminDto,
    reqUser: JwtPayload,
  ): Promise<void> {
    this.logger.log(
      `assignAdmin(classId: ${classId},
    assignAdminDto: ${JSON.stringify(assignAdminDto)},
    reqUser: ${reqUser.username} 
    )`,
    );

    const sportsClass = await this.findById(classId);

    this.validateAdmin(reqUser, sportsClass.admin);

    const user = await this.userService.findById(assignAdminDto.adminId);
    if (user.role !== UserRole.ADMIN) {
      const message = `User with id ${classId} is not admin`;

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    await this.sportsClassRepository.update(classId, { admin: user });
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`delete(id : ${id})`);

    await this.validateSportsClassExists(id);

    await this.sportsClassRepository.delete(id);
  }

  async createClassSchedule(
    createClassScheduleDto: CreateClassScheduleDto,
    reqUser: JwtPayload,
  ): Promise<void> {
    this.logger.log(
      `createClassScheduleDto: ${JSON.stringify(createClassScheduleDto)} , reqUser: ${reqUser.username} `,
    );

    const sportsClass = await this.findById(
      createClassScheduleDto.sportsClassId,
    );

    this.validateAdmin(reqUser, sportsClass.admin);

    this.validateScheduleTime(
      createClassScheduleDto.startTime,
      createClassScheduleDto.endTime,
    );

    const classSchedule = this.classScheduleRepository.create(
      createClassScheduleDto,
    );

    classSchedule.sportsClass = sportsClass;

    await this.classScheduleRepository.save(classSchedule);
  }

  async updateClassSchedule(
    classScheduleId: string,
    updateClassScheduleDto: UpdateClassScheduleDto,
    reqUser: JwtPayload,
  ): Promise<void> {
    this.logger.log(
      `updateClassScheduleDto(
      classScheduleId: ${classScheduleId},
      updateClassScheduleDto : ${JSON.stringify(updateClassScheduleDto)}),
      reqUser: ${reqUser.username} `,
    );
    await this.validateClassScheduleExists(classScheduleId);

    const classSchedule = await this.classScheduleRepository.findOne({
      where: { id: classScheduleId },
      relations: ['sportsClass', 'sportsClass.admin'],
    });

    this.validateAdmin(reqUser, classSchedule.sportsClass.admin);

    if (updateClassScheduleDto.startTime && updateClassScheduleDto.endTime) {
      this.validateScheduleTime(
        updateClassScheduleDto.startTime,
        updateClassScheduleDto.endTime,
      );
    } else if (updateClassScheduleDto.startTime) {
      this.validateScheduleTime(
        updateClassScheduleDto.startTime,
        classSchedule.endTime,
      );
    } else if (updateClassScheduleDto.endTime) {
      this.validateScheduleTime(
        classSchedule.startTime,
        updateClassScheduleDto.endTime,
      );
    }

    await this.classScheduleRepository.update(
      classScheduleId,
      updateClassScheduleDto,
    );
  }

  async deleteClassSchedule(
    classScheduleId: string,
    reqUser: JwtPayload,
  ): Promise<void> {
    this.logger.log(
      `deleteClassScheduleDto(
      classScheduleId: ${classScheduleId},
      reqUser: ${reqUser.username} `,
    );

    await this.validateClassScheduleExists(classScheduleId);

    const classSchedule = await this.classScheduleRepository.findOne({
      where: { id: classScheduleId },
      relations: ['sportsClass', 'sportsClass.admin'],
    });

    this.validateAdmin(reqUser, classSchedule.sportsClass.admin);

    await this.classScheduleRepository.delete(classScheduleId);
  }

  private validateScheduleTime(startTime: string, endTime: string): void {
    const startDate = new Date(`1970-01-01T${startTime}Z`);
    
    const endDate = new Date(`1970-01-01T${endTime}Z`);

    if (startDate > endDate) {
      const message = 'Start date must be before end date';

      this.logger.error(message);

      throw new BadRequestException(message);
    }
  }

  private async findClassWithAttendees(
    classId: string,
    reqUser: JwtPayload,
  ): Promise<SportsClass> {
    await this.validateSportsClassExists(classId);

    const sportsClass = await this.sportsClassRepository.findOne({
      where: { id: classId },
      relations: ['admin', 'attendees'],
    });

    this.validateAdmin(reqUser, sportsClass.admin);

    return sportsClass;
  }

  private validateAdmin(reqUser: JwtPayload, classAdmin: User): void {
    if (reqUser.role === UserRole.ADMIN && classAdmin.id !== reqUser.id) {
      const message = `You are not the admin of this class`;

      this.logger.error(message);

      throw new ForbiddenException(message);
    }
  }

  private async validateSportsClassExists(id: string): Promise<void> {
    if (!(await this.sportsClassRepository.exists({ where: { id } }))) {
      const message = `Sports class with id ${id} not found`;

      this.logger.error(message);

      throw new NotFoundException(message);
    }
  }

  private async validateClassScheduleExists(id: string): Promise<void> {
    if (!(await this.classScheduleRepository.exists({ where: { id } }))) {
      const message = `Schedule with id ${id} not found`;

      this.logger.error(message);

      throw new NotFoundException(message);
    }
  }
}
