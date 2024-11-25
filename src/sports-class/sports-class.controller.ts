import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SportsClassService } from './sports-class.service';
import { CreateSportsClassDto } from './dto/create-sports-class.dto';
import { UpdateSportsClassDto } from './dto/update-sports-class.dto';
import { AuthGuard } from '../guards/auth/auth.guard';
import { RolesGuard } from '../guards/roles/roles.guard';
import { Roles } from '../guards/roles/roles.decorator';
import { UserRole } from '../enums';
import { UUIDParam } from '../common/decorators/UUIDParam.decorator';
import { RestRequest } from '../common/rest-request';
import { SportsClassDto } from './dto/sports-class.dto';
import { UserDto } from '../user/dto/user.dto';
import { AssignAdminDto } from './dto/assign-admin.dto';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';
import { transformArray, transformObject } from '../common/transform';
import { SportsQueryDto } from './dto/sports-query.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('sports-class')
@UseGuards(AuthGuard, RolesGuard)
export class SportsClassController {
  private readonly logger = new Logger(SportsClassController.name);

  constructor(private readonly sportsClassService: SportsClassService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create sports class' })
  async create(
    @Body() createSportsClassDto: CreateSportsClassDto,
    @Req() req: RestRequest,
  ): Promise<void> {
    this.logger.log(
      `create( createSportsClassDto: ${JSON.stringify(createSportsClassDto)}) , 
      reqUser : ${req.user.username} )`,
    );

    await this.sportsClassService.create(createSportsClassDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sports classes' })
  async findAll(@Query() sports: SportsQueryDto): Promise<SportsClassDto[]> {
    this.logger.log(`findAll( sports: ${JSON.stringify(sports)} )`);

    const sportsClasses = await this.sportsClassService.findAll(sports);

    return transformArray(SportsClassDto, sportsClasses);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sports class by id' })
  @ApiResponse({ status: 404, description: 'Sports class not found' })
  async findById(@UUIDParam('id') id: string): Promise<SportsClassDto> {
    this.logger.log(`findOne( id : ${id} )`);

    const sportsClass = await this.sportsClassService.findById(id);

    return transformObject(SportsClassDto, sportsClass);
  }

  @Get('/attendees/:classId')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all attendees for sports class' })
  async findAttendees(
    @UUIDParam('classId') classId: string,
    @Req() req: RestRequest,
  ): Promise<UserDto[]> {
    this.logger.log(
      `findAttendees( id : ${classId} ), reqUser : ${req.user.username} )`,
    );

    const attendees = await this.sportsClassService.findAttendees(
      classId,
      req.user,
    );

    return transformArray(UserDto, attendees);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update sports class' })
  async update(
    @UUIDParam('id') id: string,
    @Body() updateSportsClassDto: UpdateSportsClassDto,
    @Req() req: RestRequest,
  ) {
    this.logger.log(
      `update( id: ${id}, updateSportsClassDto: ${JSON.stringify(updateSportsClassDto)}), reqUser : ${req.user.username} )`,
    );

    await this.sportsClassService.update(id, updateSportsClassDto, req.user);
  }

  @Patch('assign-admin/:classId')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Assign admin to sports class' })
  async assignAdmin(
    @UUIDParam('classId') classId: string,
    @Body() assignAdminDto: AssignAdminDto,
    @Req() req: RestRequest,
  ): Promise<void> {
    this.logger.log(
      `assignAdmin(classId: ${classId},
      assignAdminDto: ${JSON.stringify(assignAdminDto)}),
      reqUser : ${req.user.username} )`,
    );

    await this.sportsClassService.assignAdmin(
      classId,
      assignAdminDto,
      req.user,
    );
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete sports class' })
  @ApiResponse({ status: 204, description: 'Successfully deleted sport' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async delete(@UUIDParam('id') id: string): Promise<void> {
    this.logger.log(`delete : ${id}`);

    await this.sportsClassService.delete(id);
  }

  @Post('/schedule')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create schedule for sports class' })
  async createSchedule(
    @Body() createClassScheduleDto: CreateClassScheduleDto,
    @Req() req: RestRequest,
  ): Promise<void> {
    this.logger.log(
      `createSchedule(${JSON.stringify(createClassScheduleDto)}), reqUser : ${req.user.username} );`,
    );

    await this.sportsClassService.createClassSchedule(
      createClassScheduleDto,
      req.user,
    );
  }

  @Patch('/schedule/:classScheduleId')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update schedule for sports class' })
  async updateSchedule(
    @UUIDParam('classScheduleId') classScheduleId: string,
    @Body() updateClassScheduleDto: UpdateClassScheduleDto,
    @Req() req: RestRequest,
  ): Promise<void> {
    this.logger.log(
      `classScheduleId: ${classScheduleId},
      updateSportsClassDto: ${JSON.stringify(updateClassScheduleDto)});) ,
      reqUser : ${req.user.username}`,
    );

    await this.sportsClassService.updateClassSchedule(
      classScheduleId,
      updateClassScheduleDto,
      req.user,
    );
  }

  @Delete('/schedule/:classScheduleId')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete schedule for sports class' })
  async deleteSchedule(
    @UUIDParam('classScheduleId') classScheduleId: string,
    @Req() req: RestRequest,
  ): Promise<void> {
    this.logger.log(`deleteSchedule(
    classScheduleId: ${classScheduleId},
    reqUser : ${req.user.username} );),`);

    await this.sportsClassService.deleteClassSchedule(
      classScheduleId,
      req.user,
    );
  }
}
