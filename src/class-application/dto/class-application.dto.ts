import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../user/dto/user.dto';
import { ApplicationStatus } from '../../enums';
import { SportsClassDto } from '../../sports-class/dto/sports-class.dto';

export class ClassApplicationDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => SportsClassDto)
  sportsClass: SportsClassDto;

  @Expose()
  status: ApplicationStatus;
}
