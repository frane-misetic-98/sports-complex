import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../app-base.entity';
import { UserRole } from '../../enums';
import { SportsClass } from '../../sports-class/entities/sports-class.entity';
import { ClassApplication } from '../../class-application/entities/class-application.entity';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User extends AppBaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  private passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => SportsClass, (sportsClass) => sportsClass.admin)
  administratingClasses: SportsClass[];

  @ManyToMany(() => SportsClass, (sportsClass) => sportsClass.attendees)
  @JoinTable({
    name: 'class_attendees',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'sports_class_id', referencedColumnName: 'id' },
  })
  attendingClasses: SportsClass[];

  @OneToMany(() => ClassApplication, (sportsClass) => sportsClass.user, {
    onDelete: 'CASCADE',
  })
  pendingApplications: ClassApplication[];

  async setPassword(password: string) {
    this.passwordHash = await bcrypt.hash(password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.passwordHash);
  }
}
