import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      entities: [User],
      username: 'root',
      password: 'password',
      database: 'db',
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
