import { Module } from '@nestjs/common';
import { ClassApplicationService } from './class-application.service';
import { ClassApplicationController } from './class-application.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassApplication } from './entities/class-application.entity';
import { SportsClassModule } from '../sports-class/sports-class.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassApplication]),
    AuthenticationModule,
    SportsClassModule,
  ],
  controllers: [ClassApplicationController],
  providers: [ClassApplicationService],
})
export class ClassApplicationModule {}
