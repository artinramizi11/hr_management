import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Scope } from 'src/common/enums/scope.enum';
import { Role } from 'src/common/enums/role.enum';
import { FindManagersDto } from './dto/find-managers.dto';
import { EmployeeUser } from 'src/common/db/entities/employee-user.entity';
import { User } from 'src/common/db/entities/user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(EmployeeUser) private employeeUserRepo: Repository<EmployeeUser>
    ){}

    async createUser(createUserDto: CreateUserDto){
        const user = await this.userRepo.create({...createUserDto})
        await this.userRepo.save(user)
        return {
            message:"New user got created",
            user
        }

    }

    async deleteUser(id: number){
        const user = await this.userRepo.findOneBy({id})
        if(!user) throw new BadRequestException("This user does not exits")
          try {
          await this.userRepo.remove(user)
        return {
            message:"Sucessfully got deleted",
            user: user
        }} catch(err){
            console.log(err)
            throw new BadRequestException(err)
        }
    }

    async getUsersByManagerRole(query: FindManagersDto){
        const managers = await this.userRepo.find({where: {role: Role.Manager}, take: query.pageSize,skip: (query.page - 1) * query.pageSize})
        return managers

    }


    async findGeneralStats(){
        const users = await this.userRepo.count()
        const employees = await this.employeeUserRepo.count()
        const totalUsers = users + employees
        const totalAdmins = await this.userRepo.count({where: {role: Role.Admin}})
         const totalManagers = await this.userRepo.count({
    where: { role: Role.Manager }
  });

 const totalEmployees = await this.employeeUserRepo.count({
    where: { scope: Scope.Employee }
  });

  return{
    totalUsers,
    totalAdmins,
    totalManagers,
    totalEmployees
  }

    }

   


}
