import { IsEnum, IsNotEmpty, IsUUID, Matches } from 'class-validator';
import { DayOfWeek } from '../../enums';
import { ApiProperty } from '@nestjs/swagger';
import {
  INVALID_TIME_STRING_MESSAGE,
  TIME_STRING_REGEX,
} from '../../class-application/constants';

export class CreateClassScheduleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  sportsClassId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(TIME_STRING_REGEX, { message: INVALID_TIME_STRING_MESSAGE })
  startTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(TIME_STRING_REGEX, { message: INVALID_TIME_STRING_MESSAGE })
  endTime: string;
}
