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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClassApplicationService } from './class-application.service';
import { CreateClassApplicationDto } from './dto/create-class-application.dto';
import { AuthGuard } from '../guards/auth/auth.guard';
import { RolesGuard } from '../guards/roles/roles.guard';
import { ApplicationStatus, UserRole } from '../enums';
import { Roles } from '../guards/roles/roles.decorator';
import { UUIDParam } from '../common/decorators/UUIDParam.decorator';
import { RestRequest } from '../common/rest-request';
import { ClassApplicationDto } from './dto/class-application.dto';
import { transformArray, transformObject } from '../common/transform';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('class-application')
@UseGuards(AuthGuard, RolesGuard)
export class ClassApplicationController {
  private readonly logger = new Logger(ClassApplicationController.name);

  constructor(
    private readonly classApplicationService: ClassApplicationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all applications' })
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async findAll(): Promise<ClassApplicationDto[]> {
    this.logger.log(`findAll()`);

    const applications = await this.classApplicationService.findAll();

    return transformArray(ClassApplicationDto, applications);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application by id' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async findOneById(
    @UUIDParam('id') id: string,
    @Req() req: RestRequest,
  ): Promise<ClassApplicationDto> {
    this.logger.log(
      `findOneById( id : ${id} ), reqUser : ${req.user.username}`,
    );

    const application = await this.classApplicationService.findOneById(
      id,
      req.user,
    );

    return transformObject(ClassApplicationDto, application);
  }

  @Post()
  @ApiOperation({ summary: 'Apply for class' })
  async apply(
    @Body() createClassApplicationDto: CreateClassApplicationDto,
    @Req() req: RestRequest,
  ): Promise<void> {
    this.logger.log(
      `apply(${JSON.stringify(createClassApplicationDto)}), reqUser : ${req.user.username}`,
    );

    await this.classApplicationService.create(
      createClassApplicationDto,
      req.user,
    );
  }

  @Patch('/accept/:id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Accept a user's application" })
  async accept(
    @UUIDParam('id') id: string,
    @Req() req: RestRequest,
  ): Promise<void> {
    this.logger.log(`accept(id : ${id}), reqUser: ${req.user.username}`);

    await this.classApplicationService.performAction(
      id,
      ApplicationStatus.ACCEPTED,
      req.user,
    );
  }

  @Patch('/reject/:id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Reject a user's application" })
  async reject(
    @UUIDParam('id') id: string,
    @Req() req: RestRequest,
  ): Promise<void> {
    this.logger.log(`reject(id : ${id}), reqUser: ${req.user.username}`);

    await this.classApplicationService.performAction(
      id,
      ApplicationStatus.REJECTED,
      req.user,
    );
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete application by id' })
  @ApiResponse({ status: 204, description: 'Successfully deleted application' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async delete(
    @UUIDParam('id') id: string,
    @Req() req: RestRequest,
  ): Promise<void> {
    this.logger.log(`delete(id : ${id}), reqUser: ${req.user.username}`);

    await this.classApplicationService.delete(id, req.user);
  }
}
