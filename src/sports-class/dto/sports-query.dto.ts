import { IsOptional, IsArray, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { Sport } from '../../enums';

export class SportsQueryDto {
  @IsOptional()
  @IsArray()
  @IsEnum(Sport, { each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  sports?: Sport[];
}
