import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { SportsClass } from '../sports-class/entities/sports-class.entity';
import { ClassSchedule } from '../class-schedule/entities/class-schedule.entity';
import { ClassApplication } from '../class-application/entities/class-application.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      entities: [User, SportsClass, ClassSchedule, ClassApplication],
      username: 'root',
      password: 'password',
      database: 'db',
      synchronize: true,
      uuidExtension: 'uuid-ossp',
    }),
  ],
})
export class DatabaseModule {}
