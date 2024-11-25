import { Module } from '@nestjs/common';
import { SportsClassService } from './sports-class.service';
import { SportsClassController } from './sports-class.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportsClass } from './entities/sports-class.entity';
import { ClassSchedule } from './entities/class-schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SportsClass]),
    TypeOrmModule.forFeature([ClassSchedule]),
    AuthenticationModule,
  ],
  controllers: [SportsClassController],
  providers: [SportsClassService],
  exports: [SportsClassService],
})
export class SportsClassModule {}
