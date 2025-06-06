import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { IAuthController } from './interfaces/auth.controller.interface';
import { ChangePinDto } from './dto/change-pin.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { PoliciesGuard } from 'src/common/guards/policies.guard.';
import { CheckPolicies } from 'src/common/decorators/check-policies.decorator';
import { Action, AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { EmployeeUser } from 'src/common/db/entities/employee-user.entity';
import { User } from 'src/common/db/entities/user.entity';

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async onLogin(@Body(new ValidationPipe()) loginDto: LoginDto){
    return await this.authService.loginByPin(loginDto.pin)

  }

  @UseGuards(JwtAuthGuard,PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, EmployeeUser))
  @Post("employees/:employeeId/change-pin")
  async onEmployeeChangePin(@Param("employeeId", ParseIntPipe) employeeId: number,@Body() changePin: ChangePinDto){
    return await this.authService.changeEmployeePin(employeeId,changePin.pin)

  }


  @UseGuards(JwtAuthGuard,PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  @Post("managers/:id/change-pin")
  async changeManagerPin(@Param("id", ParseIntPipe) id: number,@Body() changePin: ChangePinDto){
    return await this.authService.changeManagerPin(id,changePin.pin)

  }


}
