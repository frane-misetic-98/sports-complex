import { Injectable } from '@nestjs/common';
import { CreateClassApplicationDto } from './dto/create-class-application.dto';
import { UpdateClassApplicationDto } from './dto/update-class-application.dto';

@Injectable()
export class ClassApplicationService {
  create(createClassApplicationDto: CreateClassApplicationDto) {
    return 'This action adds a new classApplication';
  }

  findAll() {
    return `This action returns all classApplication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classApplication`;
  }

  update(id: number, updateClassApplicationDto: UpdateClassApplicationDto) {
    return `This action updates a #${id} classApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} classApplication`;
  }
}
