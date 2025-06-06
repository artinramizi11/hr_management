import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Attendance } from "src/common/db/entities/attendance.entity";
import { Schedule } from "src/common/db/entities/schedule.entity";
import { Repository } from "typeorm";
import { SendWeeklyReminder } from "./types/weekly-reminder";



@Injectable()
export class MailService {

    constructor(
        private mailerService: MailerService,
        @InjectRepository(Schedule) private scheduleRepo: Repository<Schedule>,
        @InjectRepository(Attendance) private attendanceRepo: Repository<Attendance>
    ){}


    
    async sendWeeklyScheduleReminder(weeklyReminder: SendWeeklyReminder){

const html = `
  <h3>Weekly Schedule</h3>
  <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
    <thead>
      <tr>
        <th>Day</th>
        <th>Employee</th>
        <th>Email</th>
        <th>From</th>
        <th>To</th>
      </tr>
    </thead>
    <tbody>
      ${weeklyReminder.scheduleMail.map(schedule => {
        return `
         <tr>
    <td>${schedule.day}</td>
    <td>${schedule.employee}</td>
    <td>${schedule.email}</td>
    <td>${schedule.from}</td>
    <td>${schedule.to}</td>
  </tr>
        `
      })}
    </tbody>
  </table>
`;

        await this.mailerService.sendMail({
            to: weeklyReminder.employeeEmail,
            subject: `Schedule for the week ${weeklyReminder.scheduleWeek.start} / ${weeklyReminder.scheduleWeek.end}`,
            html: html
        })
    }

   

}