import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ClassScheduleModule } from './class-schedule/class-schedule.module';
import { SportsClassModule } from './sports-class/sports-class.module';
import { ClassApplicationModule } from './class-application/class-application.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ClassScheduleModule,
    SportsClassModule,
    ClassApplicationModule,
    AuthenticationModule,
    TokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
