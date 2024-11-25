import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Sport } from '../../enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSportsClassDto {
  @ApiProperty()
  @IsUUID()
  adminId?: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Sport)
  sport: Sport;
}
