import { Module } from '@nestjs/common';
import { SportsClassService } from './sports-class.service';
import { SportsClassController } from './sports-class.controller';

@Module({
  controllers: [SportsClassController],
  providers: [SportsClassService],
})
export class SportsClassModule {}
