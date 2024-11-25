import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { AppBaseEntity } from '../../app-base.entity';
import { SportsClass } from './sports-class.entity';
import { DayOfWeek } from '../../enums';

@Entity('class_schedule')
@Unique(['sportsClass', 'dayOfWeek', 'startTime', 'endTime'])
export class ClassSchedule extends AppBaseEntity {
  @ManyToOne(() => SportsClass, (sportsClass) => sportsClass.schedule)
  sportsClass: SportsClass;

  @Column({ type: 'enum', enum: DayOfWeek })
  dayOfWeek: DayOfWeek;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;
}
