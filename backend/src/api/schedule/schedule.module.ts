import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { User } from 'src/common/db/entities/user.entity';
import { Attendance } from 'src/common/db/entities/attendance.entity';
import { Schedule } from 'src/common/db/entities/schedule.entity';
import { MailModule } from 'src/mailer/mail.module';

@Module({
  imports:[TypeOrmModule.forFeature([Schedule,Attendance,User]),MailModule],
  controllers: [ScheduleController],
  providers: [ScheduleService,CaslAbilityFactory],
})
export class ScheduleModule1 {}
