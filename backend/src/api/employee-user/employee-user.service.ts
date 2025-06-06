import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TodaySchedule } from './types/today-schedule.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/common/db/entities/schedule.entity';
import { Repository } from 'typeorm';
import { EmployeeUser } from 'src/common/db/entities/employee-user.entity';
import { NotFoundError } from 'rxjs';
import { Attendance } from 'src/common/db/entities/attendance.entity';
import { FindAllDto } from './dto/find-employees.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { create } from 'domain';

@Injectable()
export class EmployeeUserService {

    constructor(
        @InjectRepository(Schedule) private scheduleRepo: Repository<Schedule>,
        @InjectRepository(EmployeeUser) private employeUserRep: Repository<EmployeeUser>,
        @InjectRepository(Attendance) private attendanceRepo: Repository<Attendance>
    ){}

    async createEmployee(createEmployee: CreateEmployeeDto){

        const employeeExists = await this.employeUserRep.findOneBy({email: createEmployee.email})

        if(employeeExists){
            throw new ConflictException("This email already exists, try different one")
        }
       try {


         const employee = await this.employeUserRep.create({
            email: createEmployee.email,
            first_name: createEmployee.first_name,
            last_name: createEmployee.last_name,
            pin: createEmployee.pin
            
        })

        await this.employeUserRep.save(employee)

        return {
            message:"You created sucessfully new employee",
            employee
        }
       } catch(err){
        throw new BadRequestException(err?.message)
       }

    }

    async deleteEmployee(employeeId: number){
        const employeeExists = await this.employeUserRep.findOneBy({id: employeeId})
        if(!employeeExists) throw new BadRequestException("No employee exists by this id")
        try {
    await this.employeUserRep.remove(employeeExists)
    return {
        message:"Employee got deleted sucessfully",
        employee: employeeExists
    }} catch(err) {
        console.log(err)
        throw new BadRequestException(err)
    }

    }


    async todayEmployeeSchedule(employeeId: number){

        const date = new Date()

       const schedule = await this.scheduleRepo.findOneBy({employee_user: {id: employeeId}, date})

       if(!schedule) throw new NotFoundException("No schedule for today")

        const attendance = await this.attendanceRepo.findOneBy({schedule: {id: schedule.id}})

        return {
            schedule,
            attendance
        }

    }

    async findEmployeeSchedules(employeeId: number){
        const schedules = await this.scheduleRepo.find({where: {employee_user: {id: employeeId}},relations:['attendance'], order: {date: "DESC"}})
        return schedules

    }

    async findAllEmployees(query: FindAllDto){
        const totalEmployees = await this.employeUserRep.count()
        const { page , size } = query
        const filtered = await this.employeUserRep.find({skip: (page - 1) * size, take: size})

        return {
            employees: filtered,
            totalEmployees: totalEmployees
        }
    }




 


}
