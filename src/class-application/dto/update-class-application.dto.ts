import { PartialType } from '@nestjs/mapped-types';
import { CreateClassApplicationDto } from './create-class-application.dto';

export class UpdateClassApplicationDto extends PartialType(CreateClassApplicationDto) {}
