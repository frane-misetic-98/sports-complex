import { UserRole } from '../../enums';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class JwtPayload {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
