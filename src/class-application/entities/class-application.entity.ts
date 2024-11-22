import { Column, Entity, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../app-base.entity';
import { User } from '../../user/entities/user.entity';
import { SportsClass } from '../../sports-class/entities/sports-class.entity';
import { ApplicationStatus } from '../../enums';

@Entity('class_applications')
export class ClassApplication extends AppBaseEntity {
  @ManyToOne(() => User, (user) => user.pendingApplications)
  user: User;

  @ManyToOne(
    () => SportsClass,
    (sportsClass) => sportsClass.pendingApplications,
  )
  sportsClass: SportsClass;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;
}
