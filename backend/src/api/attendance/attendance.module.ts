import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from 'src/common/db/entities/attendance.entity';
import { EmployeeUser } from 'src/common/db/entities/employee-user.entity';
import { Schedule } from 'src/common/db/entities/schedule.entity';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';

@Module({
  imports:[TypeOrmModule.forFeature([Attendance,EmployeeUser,Schedule])],
  controllers: [AttendanceController],
  providers: [AttendanceService, CaslAbilityFactory],
})
export class AttendanceModule {}
