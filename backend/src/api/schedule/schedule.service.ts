import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/common/db/entities/schedule.entity';
import { Between, Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Attendance } from 'src/common/db/entities/attendance.entity';
import { User } from 'src/common/db/entities/user.entity';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ReminderScheduleDto } from './dto/reminder-schedule.dto';
import { MailService } from 'src/mailer/mailer.service';

@Injectable()
export class ScheduleService {

    constructor(
        @InjectRepository(Schedule) private scheduleRepo: Repository<Schedule>,
        @InjectRepository(Attendance) private attendanceRepo: Repository<Attendance>,
        @InjectRepository(User) private userRepo: Repository<User>,
        private mailService: MailService
    ){}

    async findAllSchedules(){
        return await this.scheduleRepo.find()

    }

    async createSchedule(createScheduleDto: CreateScheduleDto){

        const scheduleExists = await this.scheduleRepo.findOneBy({date: createScheduleDto.date, employee_user: {id: createScheduleDto.employee_user_id}})

        if(scheduleExists) throw new BadRequestException(`This employee has already an schedule on this date`)

     
       try {


       const newSchedule = this.scheduleRepo.create({
  date: new Date(createScheduleDto.date),
  starts_at: new Date(createScheduleDto.starts_at),
  ends_at: new Date(createScheduleDto.ends_at),
  employee_user: {id: createScheduleDto.employee_user_id},
  scheduled_by: {id: createScheduleDto.scheduled_by_user_id}
});
     await this.scheduleRepo.save(newSchedule)


      const attendance =  await this.attendanceRepo.create({schedule: {id: newSchedule.id}})

      await this.attendanceRepo.save(attendance)


        return newSchedule
       } catch(err){
        return err
       }

    }

    async deleteSchedule(scheduleId: number){

        try {

                  const schedule =  await this.scheduleRepo.findOneBy({id: scheduleId})

                  if(!schedule) throw new BadRequestException("No schedule exists by this id")

            await this.scheduleRepo.remove(schedule)
  
    return {message:"This schedule got removed automatically"}
        } catch(err) {
            return err?.response
        }

    }

    async updateSchedule(scheduleId: number, updateScheduleDto: UpdateScheduleDto){
        
        const schedule = await this.scheduleExistsForEmployee(scheduleId,updateScheduleDto.employee_user_id)
    
        try {
            updateScheduleDto.date ? schedule.date = updateScheduleDto.date : null 
        updateScheduleDto.starts_at ? schedule.starts_at = new Date(updateScheduleDto.starts_at) : null 
        updateScheduleDto.ends_at ? schedule.ends_at = new Date(updateScheduleDto.ends_at) : null

        await this.scheduleRepo.save(schedule)

        return {
            message:"Schedule got updated sucessfully"
        }
        } catch(err) {
           
            return err
        }

    }
    
    async getScheduleById(id: number){
        const schedule = await this.scheduleRepo.findOneBy({id})
        if(!schedule) throw new NotFoundException("No schedule exists by this id")
            return schedule
    }

    async scheduleExistsForEmployee(scheduleId: number, employeeId: number){
        const schedule = await this.scheduleRepo.findOneBy({id: scheduleId, employee_user: {id: employeeId}})
        if(!schedule) throw new BadRequestException("This schedule does not exists")
            return schedule
    }

    async reminderWeeklySchedule(reminderSchedule: ReminderScheduleDto){

        const schedules = await this.scheduleRepo.find({
            where: {date: Between(new Date(reminderSchedule.start_week_day), new Date(reminderSchedule.end_week_day)),
                
            }
        })

        const employeesMails = [...new Set(schedules.map(schedule => schedule.employee_user.email))]
    

       const scheduleMail = schedules.map(schedule => {
        return {
            day: schedule.date,
            employee: schedule.employee_user.first_name + schedule.employee_user.last_name,
            email: schedule.employee_user.email,
            from: schedule.starts_at,
            to: schedule.ends_at
        }
       })

       try {

        for (const employeeMail of employeesMails){
        
        await this.mailService.sendWeeklyScheduleReminder({
            employeeEmail: employeeMail,
            scheduleMail: scheduleMail,
            scheduleWeek: {
                start: reminderSchedule.start_week_day,
                end: reminderSchedule.end_week_day
            },

        })
       }
    
        return {
            message:`Reminder mails for the schedule between dates ${reminderSchedule.start_week_day} and ${reminderSchedule.end_week_day} got sent`
        }
       } catch(err) {
        throw new BadRequestException(err)
       }

    }
}
