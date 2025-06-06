import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";
import { ScheduleApi } from "../api/schedule-api";
import { AttendanceDetailType } from "./users.service";
import { ScheduleType } from "../types/schedule.type";
import { WeeklyReminderDto } from "../types/weekly-reminder.type";

export type CreateScheduleType = {
    date: Date
    starts_at: string 
    ends_at: string
    employee_user_id: number
    scheduled_by_user_id: number
}

@Injectable({providedIn:"root"})
export class ScheduleService {

    constructor(private scheduleApi: ScheduleApi){}

    private _schedules$ = new BehaviorSubject<ScheduleType[]>([])
    private _selectedSchedulesAttendances = new BehaviorSubject<AttendanceDetailType[]>([])
    private _singleSchedule$  = new BehaviorSubject<ScheduleType>({} as ScheduleType)

    getSchedules(){
        return this.scheduleApi.findSchedules().pipe(map(data => {
            this._schedules$.next(data)
            return data
        }))

    }

    findScheduleById(id: number){
        return this.scheduleApi.findScheduleById(id).pipe(map(data => {
            this._singleSchedule$.next(data)
            return data
        }))
    }

    createSchedule(schedule: CreateScheduleType){
        return this.scheduleApi.createSchedule(schedule).pipe(map(data => {
            this._schedules$.next([...this._schedules$.value, data])
            return data
        }))

    }

    removeSchedule(scheduleId: number){
        return this.scheduleApi.deleteSchedule(scheduleId).pipe(map(data => {
            this._schedules$.next(this._schedules$.value.filter(schedule => schedule.id !== scheduleId))
            return data
        }))
    }


    findEmployeeSchedules(employeeId: number){
        return this.scheduleApi.findEmployeeIdSchedules(employeeId).pipe(map(data => {
            this._selectedSchedulesAttendances.next(data)
            return data
        }))
    }

    sendWeeklyReminder(data: WeeklyReminderDto){
        return this.scheduleApi.weeklyReminder(data).pipe(map(data => {
            return data
        }))
    }

    get schedules$ (){
        return this._schedules$.asObservable()
    }

    get selectedSchedulesAttendances$ (){
        return this._selectedSchedulesAttendances.asObservable()
    }

    get singleSchedule$(){
        return this._singleSchedule$.asObservable()
    }

}