import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../guards/auth/auth.guard';
import { RolesGuard } from '../guards/roles/roles.guard';
import { UUIDParam } from '../common/decorators/UUIDParam.decorator';
import { UserRole } from '../enums';
import { Roles } from '../guards/roles/roles.decorator';
import { RestRequest } from '../common/rest-request';
import { UserDto } from './dto/user.dto';
import { transformArray, transformObject } from '../common/transform';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @Roles(UserRole.SUPERADMIN)
  async findAll(): Promise<UserDto[]> {
    this.logger.log('findAll');
    const users = await this.userService.findAll();

    return users ? transformArray(UserDto, users) : [];
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOneById(@UUIDParam('id') id: string): Promise<UserDto | null> {
    this.logger.log(`findOneById : ${id}`);

    const user = await this.userService.findById(id);

    return user ? transformObject(UserDto, user) : null;
  }

  @Patch('/grant-admin-privileges/:id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Grant user admin privileges' })
  @ApiResponse({ status: 204, description: 'Success' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async grantAdminPrivileges(@UUIDParam('id') id: string): Promise<void> {
    this.logger.log(`grantAdminPrivileges : ${id}`);

    await this.userService.grantAdminPrivileges(id);
  }

  @Patch('/revoke-admin-privileges/:id')
  @Roles(UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Revoke user's admin privileges" })
  @ApiResponse({ status: 204, description: 'Success' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async revokeAdminPrivileges(
    @UUIDParam('id') id: string,
    @Req() req: RestRequest,
  ): Promise<void> {
    this.logger.log(
      `revokeAdminPrivileges : ${id}, reqUser: ${req.user.username} `,
    );

    await this.userService.revokeAdminPrivileges(id, req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 204, description: 'Success' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@UUIDParam('id') id: string): Promise<void> {
    this.logger.log(`remove : ${id}`);

    await this.userService.delete(id);
  }
}
