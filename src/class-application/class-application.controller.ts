import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClassApplicationService } from './class-application.service';
import { CreateClassApplicationDto } from './dto/create-class-application.dto';
import { UpdateClassApplicationDto } from './dto/update-class-application.dto';
import { AuthGuard } from '../guards/auth/auth.guard';

@Controller('class-application')
@UseGuards(AuthGuard)
export class ClassApplicationController {
  constructor(
    private readonly classApplicationService: ClassApplicationService,
  ) {}

  @Post()
  create(@Body() createClassApplicationDto: CreateClassApplicationDto) {
    return this.classApplicationService.create(createClassApplicationDto);
  }

  @Get()
  findAll() {
    return this.classApplicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classApplicationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassApplicationDto: UpdateClassApplicationDto,
  ) {
    return this.classApplicationService.update(+id, updateClassApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classApplicationService.remove(+id);
  }
}
