import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  adminId: string;
}
