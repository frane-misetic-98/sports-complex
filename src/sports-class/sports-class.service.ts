import { Injectable } from '@nestjs/common';
import { CreateSportsClassDto } from './dto/create-sports-class.dto';
import { UpdateSportsClassDto } from './dto/update-sports-class.dto';

@Injectable()
export class SportsClassService {
  create(createSportsClassDto: CreateSportsClassDto) {
    return 'This action adds a new sportsClass';
  }

  findAll() {
    return `This action returns all sportsClass`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sportsClass`;
  }

  update(id: number, updateSportsClassDto: UpdateSportsClassDto) {
    return `This action updates a #${id} sportsClass`;
  }

  remove(id: number) {
    return `This action removes a #${id} sportsClass`;
  }
}
