import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindManagersDto } from './dto/find-managers.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { CheckPolicies } from 'src/common/decorators/check-policies.decorator';
import { Action, AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { PoliciesGuard } from 'src/common/guards/policies.guard.';
import { User } from 'src/common/db/entities/user.entity';

@UseGuards(JwtAuthGuard,PoliciesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @Get("general-stats")
  async getGeneralStats(){
    return await this.userService.findGeneralStats()

  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, User))
  @Post()
  async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto){
    return await this.userService.createUser(createUserDto)

  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, User))
  @Delete(":id")
  async deleteUser(@Param("id", ParseIntPipe) id: number){
    return await this.userService.deleteUser(id)
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, User))
  @Get("managers")
  async getUsersByManagerRole(@Query(new ValidationPipe) query: FindManagersDto){
    return await this.userService.getUsersByManagerRole(query)
  }

 


  
}
