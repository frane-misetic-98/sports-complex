import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassApplicationDto {
  @ApiProperty()
  @IsUUID()
  sportsClassId: string;
}
