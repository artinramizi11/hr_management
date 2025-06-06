import { Module } from '@nestjs/common';
import { EmployeeUserService } from './employee-user.service';
import { EmployeeUserController } from './employee-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeUser } from 'src/common/db/entities/employee-user.entity';
import { Schedule } from 'src/common/db/entities/schedule.entity';
import { Attendance } from 'src/common/db/entities/attendance.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';

@Module({
  imports:[TypeOrmModule.forFeature([EmployeeUser,Schedule,Attendance])],
  controllers: [EmployeeUserController],
  providers: [EmployeeUserService,CaslAbilityFactory],
})
export class EmployeeUserModule {}
