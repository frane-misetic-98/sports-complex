import { UserRole } from '../../enums';
import { Exclude, Expose, Type } from 'class-transformer';
import { SportsClassDto } from '../../sports-class/dto/sports-class.dto';
import { ClassApplicationDto } from '../../class-application/dto/class-application.dto';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  firstName: string;

  // @Exclude()
  // passwordHash: string;

  @Expose()
  lastName: string;

  @Expose()
  role: UserRole;

  @Expose()
  @Type(() => SportsClassDto)
  administratingClasses: SportsClassDto[];

  @Expose()
  @Type(() => SportsClassDto)
  attendingClasses: SportsClassDto[];

  @Expose()
  @Type(() => ClassApplicationDto)
  pendingApplications: ClassApplicationDto[];
}
