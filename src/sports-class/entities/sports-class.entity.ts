import { AppBaseEntity } from '../../app-base.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Sport } from '../../enums';
import { ClassApplication } from '../../class-application/entities/class-application.entity';
import { ClassSchedule } from '../../class-schedule/entities/class-schedule.entity';

@Entity('sports_classes')
@Unique(['name', 'sport'])
export class SportsClass extends AppBaseEntity {
  @ManyToOne(() => User, (user) => user.administratingClasses)
  admin: User;

  @Column()
  description: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Sport })
  sport: Sport;

  @ManyToMany(() => User, (user) => user.attendingClasses)
  attendees: User[];

  @ManyToOne(
    () => ClassApplication,
    (classApplication) => classApplication.sportsClass,
    { onDelete: 'CASCADE' },
  )
  pendingApplications: ClassApplication[];

  @OneToMany(
    () => ClassSchedule,
    (classSchedule) => classSchedule.sportsClass,
    { onDelete: 'CASCADE' },
  )
  schedule: ClassSchedule[];
}
