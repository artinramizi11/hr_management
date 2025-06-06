import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { AttendanceModule } from './api/attendance/attendance.module';
import { ConfigModule } from '@nestjs/config';
import config from './common/config/config';
import { dbConfig } from './common/config/db-config';
import { CaslModule } from './casl/casl.module';
import { EmployeeUserModule } from './api/employee-user/employee-user.module';
import { MailModule } from './mailer/mail.module';
import { ScheduleModule1 } from './api/schedule/schedule.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MailModule,
    CaslModule,
    ConfigModule.forRoot({load: [config],isGlobal: true}),
    TypeOrmModule.forRootAsync(dbConfig), 
    UserModule, 
    EmployeeUserModule, 
    ScheduleModule1, 
    AttendanceModule, 
    AuthModule, CaslModule, MailModule,


],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
