import { PartialType } from '@nestjs/mapped-types';
import { CreateSportsClassDto } from './create-sports-class.dto';

export class UpdateSportsClassDto extends PartialType(CreateSportsClassDto) {}
