import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { EmployeeUserService } from './employee-user.service';
import { FindAllDto } from './dto/find-employees.dto';
import { Scopes } from 'src/common/decorators/scope.decorator';
import { Scope } from 'src/common/enums/scope.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Action, AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { Schedule } from 'src/common/db/entities/schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PoliciesGuard } from 'src/common/guards/policies.guard.';
import { CheckPolicies } from 'src/common/decorators/check-policies.decorator';
import { EmployeeUser } from 'src/common/db/entities/employee-user.entity';
import { Attendance } from 'src/common/db/entities/attendance.entity';
import { User } from 'src/common/db/entities/user.entity';
import { IEmployeeUserController } from './interfaces/employee-user.interface';
import { CreateEmployeeDto } from './dto/create-employee.dto';


@UseGuards(JwtAuthGuard,PoliciesGuard)
@Controller('employee-users')
export class EmployeeUserController implements IEmployeeUserController {

  constructor(
    private readonly employeeUserService: EmployeeUserService,
    private caslService: CaslAbilityFactory,
    @InjectRepository(Schedule) private scheduleRepo: Repository<Schedule>
  ) {}


  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, EmployeeUser))
  @Get()
  async findAllEmployees(@Query(new ValidationPipe()) query: FindAllDto){
    return await this.employeeUserService.findAllEmployees(query)

  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, EmployeeUser))
  @Post()
  async createEmployee(@Body(new ValidationPipe) createEmployee: CreateEmployeeDto){
    return await this.employeeUserService.createEmployee(createEmployee)

  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, EmployeeUser))
  @Delete(":employeeId")
  async deleteEmployee(@Param("employeeId", ParseIntPipe) employeeId: number){
    return await this.employeeUserService.deleteEmployee(employeeId)

  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Schedule))
  @Get(":employeeId/today-schedule")
  async getTodaySchedule(@Param("employeeId", ParseIntPipe) employeeId: number){
    return await this.employeeUserService.todayEmployeeSchedule(employeeId)

  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Schedule))
  @Get(":employeeId/total-schedules")
  async getEmployeeTotalSchedules(@Param("employeeId", ParseIntPipe) employeeId: number){
    return await this.employeeUserService.findEmployeeSchedules(employeeId)
    
  }



}
