import { Expose, Type } from 'class-transformer';
import { SportsClassDto } from './sports-class.dto';
import { DayOfWeek } from '../../enums';

export class ClassScheduleDto {
  @Expose()
  @Type(() => SportsClassDto)
  sportsClass: SportsClassDto;

  @Expose()
  dayOfWeek: DayOfWeek;

  @Expose()
  startTime: string;

  @Expose()
  endTime: string;
}
