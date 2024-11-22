import { Module } from '@nestjs/common';
import { ClassApplicationService } from './class-application.service';
import { ClassApplicationController } from './class-application.controller';
import { TokenModule } from '../token/token.module';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TokenModule],
  controllers: [ClassApplicationController],
  providers: [ClassApplicationService, UserService],
})
export class ClassApplicationModule {}
