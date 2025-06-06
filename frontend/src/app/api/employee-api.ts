import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { EnterAttendanceType } from "../types/enter-attendance.type";
import { AttendanceDetailType, EmployeeType } from "../services/users.service";
import { ScheduleType } from "../types/schedule.type";
import { AttendanceType } from "../types/attendance.type";
import { ExitAttendanceType } from "../types/exit-attendance.type";
import { CreateEmployeeType } from "../types/create-employee.type";

@Injectable({providedIn:"root"})
export class EmployeeApi {

    httpClient = inject(HttpClient)

    findEmployeeSchedules(employeeId: number){
        return this.httpClient.get<AttendanceDetailType[]>(`http://localhost:3000/employee-users/${employeeId}/total-schedules`)
    }

    findEmployees(page: number, size: number){
        return this.httpClient.get<{employees: EmployeeType[],totalEmployees: number}>(`http://localhost:3000/employee-users?page=${page}&&size=${size}`)

    }

    createEmployee(createEmployee: CreateEmployeeType){
        return this.httpClient.post<{message: string, employee: EmployeeType}>("http://localhost:3000/employee-users", createEmployee)
    }

    deleteEmployee(employeeId: number){
        return this.httpClient.delete<{message: string, employee: EmployeeType}>(`http://localhost:3000/employee-users/${employeeId}`)
    }

    findTodayEmployeeSchedule(employeeId: number){
        return this.httpClient.get<{schedule: ScheduleType, attendance: AttendanceType}>(`http://localhost:3000/employee-users/${employeeId}/today-schedule`)
    }

    onEnterTodayAttendance(enterAttendance: EnterAttendanceType){
        return this.httpClient.post<{message: string,entered_at: string}>("http://localhost:3000/attendance/enter-on", enterAttendance)
    }

    onExitTodayAttendance(exitAttendance: ExitAttendanceType){
        return this.httpClient.post<{message: string, exited_at: string}>("http://localhost:3000/attendance/exit-on", exitAttendance)
    }

    
}