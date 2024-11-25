import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../user/dto/user.dto';
import { Sport } from '../../enums';
import { ClassApplicationDto } from '../../class-application/dto/class-application.dto';
import { ClassScheduleDto } from './class-schedule.dto';

export class SportsClassDto {
  @Expose()
  @Type(() => String)
  id: string;

  @Expose()
  @Type(() => UserDto)
  admin: UserDto;

  @Expose()
  description: string;

  @Expose()
  name: string;

  @Expose()
  sport: Sport;

  @Expose()
  @Type(() => UserDto)
  attendees: UserDto[];

  @Expose()
  @Type(() => ClassApplicationDto)
  pendingApplications: ClassApplicationDto[];

  @Expose()
  @Type(() => ClassScheduleDto)
  schedule: ClassScheduleDto[];
}
