import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SportsClassService } from './sports-class.service';
import { CreateSportsClassDto } from './dto/create-sports-class.dto';
import { UpdateSportsClassDto } from './dto/update-sports-class.dto';

@Controller('sports-class')
export class SportsClassController {
  constructor(private readonly sportsClassService: SportsClassService) {}

  @Post()
  create(@Body() createSportsClassDto: CreateSportsClassDto) {
    return this.sportsClassService.create(createSportsClassDto);
  }

  @Get()
  findAll() {
    return this.sportsClassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sportsClassService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSportsClassDto: UpdateSportsClassDto) {
    return this.sportsClassService.update(+id, updateSportsClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sportsClassService.remove(+id);
  }
}
