import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from 'src/common/db/entities/attendance.entity';
import { Repository } from 'typeorm';
import { MakeAttendanceDto } from './dto/make-attendance.dto';
import { Schedule } from 'src/common/db/entities/schedule.entity';
import { EmployeeUser } from 'src/common/db/entities/employee-user.entity';
import { ExitAttendanceDto } from './dto/exit-attendance.dto';

@Injectable()
export class AttendanceService {

    constructor(
        @InjectRepository(Attendance) private attendanceRepo: Repository<Attendance>,
        @InjectRepository(Schedule) private scheduleRepo: Repository<Schedule>,
        @InjectRepository(EmployeeUser) private employeeRepo: Repository<EmployeeUser>
    ){}

    async enterOnAttendance(makeAttendanceDto: MakeAttendanceDto){

        const {schedule,employee} = await this.employeHasScheduledAttendance(makeAttendanceDto.employee_user_id,makeAttendanceDto.date)


        const attendanceExists = await this.attendanceRepo.findOneBy({schedule: {id: schedule.id}})
   
       if(attendanceExists){

        if(attendanceExists.entered_at){
            throw new ConflictException("You already entered at this day")
        }

        attendanceExists.entered_at = makeAttendanceDto.date
        await this.attendanceRepo.save(attendanceExists)
        return {
            message:"You made the attendance sucessfully",
            entered_at: makeAttendanceDto.entered_at
        }

       }
          const createAttendance = await this.attendanceRepo.create({
                schedule: {id: schedule.id},
                entered_at: makeAttendanceDto.entered_at
            })
            try {
                await this.attendanceRepo.save(createAttendance)
            return {
                message:"Thanks for your attendance",
                date: makeAttendanceDto.date
            }
            } catch(err) {
                return err
            }

    
        
    }

    async exitAttendance(exitAttendanceDto: ExitAttendanceDto){

        const { schedule , employee} = await this.employeHasScheduledAttendance(exitAttendanceDto.employee_user_id,exitAttendanceDto.date)

        const attendanceExists = await this.attendanceRepo.findOneBy({schedule: {id: schedule.id}})

    if(!attendanceExists) throw new BadRequestException("You dont have any scheduled date to make attendance ")

        if(attendanceExists){
            const exitDoesntExists = attendanceExists.exited_at === null 

            if(exitDoesntExists){
               try {
                 attendanceExists.exited_at = exitAttendanceDto.exited_at
                await this.attendanceRepo.save(attendanceExists)

                return {
                    message:"You made the exit attendance sucessfully for this day",
                    exited_at: exitAttendanceDto.exited_at
                }
               } catch(err) {
                return err
               }
            }
            throw new ConflictException("You already made the exit attendance")
        }

   

    }

    async employeHasScheduledAttendance(employeeId: number,date: Date){
        const employeExists = await this.employeeRepo.findOneBy({id: employeeId})
        if(!employeExists) throw new BadRequestException("No employ exists by this id")
            const scheduleExists = await this.scheduleRepo.findOneBy({date, employee_user: {id: employeExists.id}})
        if(!scheduleExists) throw new BadRequestException("No schedule exists for this employee id")


            return {
        schedule: scheduleExists,
        employee: employeExists
        }

    }

  

}
