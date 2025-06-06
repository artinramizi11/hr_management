import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AttendanceDetailType } from "../services/users.service";
import { CreateScheduleType } from "../services/schedule.service";
import { ScheduleType } from "../types/schedule.type";
import { WeeklyReminderDto } from "../types/weekly-reminder.type";

@Injectable({providedIn:"root"})
export class ScheduleApi {

    httpClient = inject(HttpClient)

    findSchedules(){
        return this.httpClient.get<ScheduleType[]>("http://localhost:3000/schedules")
    }

    createSchedule(createSchedule: CreateScheduleType){
        return this.httpClient.post<ScheduleType>("http://localhost:3000/schedules/create", createSchedule)
    }
    
    deleteSchedule(scheduleId: number){
        return this.httpClient.delete<{message: string}>(`http://localhost:3000/schedules/${scheduleId}`)
    }

    findEmployeeIdSchedules(employeeId: number){
        return this.httpClient.get<AttendanceDetailType[]>(`http://localhost:3000/employee-users/${employeeId}/total-schedules`)
    }

    findScheduleById(id: number){
        return this.httpClient.get<ScheduleType>(`http://localhost:3000/schedules/${id}`)
    }

    weeklyReminder(data: WeeklyReminderDto){
        return this.httpClient.post<{message: string}>("http://localhost:3000/schedules/reminder", {start_week_day: data.start_day, end_week_day: data.end_day})

    }
    
}