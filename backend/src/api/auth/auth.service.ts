import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/db/entities/user.entity';
import { Repository } from 'typeorm';
import { UserPayload } from './types/user-payload';
import { EmployeeUserPayload } from './types/employee-payload';
import { EmployeeUser } from 'src/common/db/entities/employee-user.entity';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(EmployeeUser) private employeeRep: Repository<EmployeeUser>,
        private jwtService: JwtService
    ){}


    async loginByPin(pin: string){

        const isUser = await this.userRepo.findOneBy({pin})

        if(isUser){
          
            const payload: UserPayload = {id: isUser.id, role: isUser.role, scope: isUser.scope, username: isUser.username} 
            const token = await this.jwtService.sign(payload)
           return {
            message:"You got logged in as user",
            token
           }
        }

        const isEmployee = await this.employeeRep.findOneBy({pin})

        if(isEmployee){
            const payload: EmployeeUserPayload = {id: isEmployee.id, scope: isEmployee.scope, email: isEmployee.email}
          const token = await this.jwtService.sign(payload)
          return {
            message: "You got logged in sucessfully as employee",
            token 
          }
        }

        throw new UnauthorizedException("Invalid PIN")
        

    }

    async changeEmployeePin(employeeId: number,pin: string){
      const employee = await this.employeeRep.findOneBy({id: employeeId})
      if(!employee) throw new NotFoundException("No employee exists by this id")
        employee.pin = pin
      try {
        await this.employeeRep.save(employee)
      return {
        message:"Employee PIN got sucessfully changed"
      }

      } catch (err){
        console.log(err)
        throw new BadRequestException(err)
      }
    }

    async changeManagerPin(managerId: number, pin: string){
      const user = await this.userRepo.findOneBy({id: managerId})
      if(!user) throw new BadRequestException("No user exists by this id")
        if(user.role === Role.Manager){
          user.pin = pin
          await this.userRepo.save(user)
          return {
            message: `PIN for ${user.username} got sucessfully changed`,
            manager: user
          }
        }
        throw new UnauthorizedException("This user does not have manager role")

    }

  

 

 

}
