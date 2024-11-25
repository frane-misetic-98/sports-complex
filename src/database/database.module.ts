import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { SportsClass } from '../sports-class/entities/sports-class.entity';
import { ClassSchedule } from '../sports-class/entities/class-schedule.entity';
import { ClassApplication } from '../class-application/entities/class-application.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UserRole } from '../enums';
import { Application } from 'express';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: configService.get<boolean>('DB_SYNC'),
        entities: [User, SportsClass, ClassSchedule, ClassApplication],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
})
export class DatabaseModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (
      await this.userRepository.exists({ where: { username: 'superadmin' } })
    ) {
      this.logger.log('Superadmin user already in database');
      return;
    }

    const user = this.userRepository.create({
      firstName: 'superadmin',
      lastName: 'superadmin',
      username: 'superadmin',
      role: UserRole.SUPERADMIN,
    });

    await user.setPassword('superadmin');

    await this.userRepository.save(user);

    this.logger.log('Superadmin user seeded to database');
  }
}
