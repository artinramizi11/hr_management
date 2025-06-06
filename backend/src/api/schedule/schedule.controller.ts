import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { PoliciesGuard } from 'src/common/guards/policies.guard.';
import { CheckPolicies } from 'src/common/decorators/check-policies.decorator';
import { Action, AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { IScheduleController } from './interfaces/schedule.controller.interface';
import { Schedule } from 'src/common/db/entities/schedule.entity';
import { ReminderScheduleDto } from './dto/reminder-schedule.dto';


@UseGuards(JwtAuthGuard,PoliciesGuard)
@Controller('schedules')
export class ScheduleController implements IScheduleController {

  constructor(private readonly scheduleService: ScheduleService) {}


  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Schedule))
  @Get()
  async getSchedules(){
    return await this.scheduleService.findAllSchedules()

  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read,Schedule))
  @Get(":id")
  async getScheduleById(@Param("id", ParseIntPipe) id: number){
    return await this.scheduleService.getScheduleById(id)

  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Schedule))
  @Post("create")
  async createSchedule(@Body(new ValidationPipe()) createScheduleDto: CreateScheduleDto){
    return await this.scheduleService.createSchedule(createScheduleDto)
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Schedule))
  @Delete(":scheduleId")
  async deleteSchedule(@Param("scheduleId", ParseIntPipe) scheduleId: number){
    return await this.scheduleService.deleteSchedule(scheduleId)
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Schedule))
  @Patch(":scheduleId")
  async updateSchedule(@Param("scheduleId", ParseIntPipe) scheduleId: number, @Body() updateScheduleDto:UpdateScheduleDto){
    return await this.scheduleService.updateSchedule(scheduleId,updateScheduleDto)

  }

  @Post("reminder")
  async reminderWeekSchedule(@Body(new ValidationPipe()) body: ReminderScheduleDto){
    return await this.scheduleService.reminderWeeklySchedule(body)


  }




}
