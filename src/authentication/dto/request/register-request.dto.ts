import { IsNotEmpty } from 'class-validator';

export class RegisterRequestDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
