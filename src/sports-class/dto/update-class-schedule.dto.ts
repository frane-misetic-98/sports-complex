import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID, Matches } from 'class-validator';
import { DayOfWeek } from '../../enums';
import {
  INVALID_TIME_STRING_MESSAGE,
  TIME_STRING_REGEX,
} from '../../class-application/constants';

export class UpdateClassScheduleDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;

  @ApiProperty()
  @IsOptional()
  @Matches(TIME_STRING_REGEX, { message: INVALID_TIME_STRING_MESSAGE })
  startTime?: string;

  @ApiProperty()
  @IsOptional()
  @Matches(TIME_STRING_REGEX, { message: INVALID_TIME_STRING_MESSAGE })
  endTime?: string;
}
