import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MakeAttendanceDto } from './dto/make-attendance.dto';
import { ExitAttendanceDto } from './dto/exit-attendance.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { PoliciesGuard } from 'src/common/guards/policies.guard.';
import { CheckPolicies } from 'src/common/decorators/check-policies.decorator';
import { Action, AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Attendance } from 'src/common/db/entities/attendance.entity';
import { IAttendanceController } from './interfaces/attendance-controller.interface';

@UseGuards(JwtAuthGuard,PoliciesGuard)
@Controller('attendance')
export class AttendanceController implements IAttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}


  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Attendance))
  @Post("enter-on")
  async enterOn(@Body(new ValidationPipe()) makeAttendanceDto: MakeAttendanceDto){
    return await this.attendanceService.enterOnAttendance(makeAttendanceDto)

  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Attendance))
  @Post("exit-on")
  async leaveOn(@Body(new ValidationPipe()) exitAttendanceDto: ExitAttendanceDto){
    return await this.attendanceService.exitAttendance(exitAttendanceDto)
    
  }

}
