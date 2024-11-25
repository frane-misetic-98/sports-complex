import { UserRole } from '../enums';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class JwtPayload {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  role: UserRole;
}
