import { Expose } from 'class-transformer';

export class UpdateUserDto {
  @Expose()
  firstName?: string;

  @Expose()
  lastName?: string;

  @Expose()
  username?: string;
}
