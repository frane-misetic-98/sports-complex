import { IsEnum, IsOptional } from 'class-validator';
import { Sport } from '../../enums';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSportsClassDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Sport)
  sport?: Sport;
}
