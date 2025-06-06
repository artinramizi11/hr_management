import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, filter, map, of } from "rxjs";
import { ScheduleType } from "../types/schedule.type";
import { AttendanceType } from "../types/attendance.type";
import { EmployeeApi } from "../api/employee-api";
import { AttendanceDetailType, EmployeeType } from "./users.service";
import { EnterAttendanceType } from "../types/enter-attendance.type";
import { ExitAttendanceType } from "../types/exit-attendance.type";
import { CreateEmployeeType } from "../types/create-employee.type";
import { AuthApiService } from "../api/auth-api";

export type FilterEmployeeType = {
    first_name: string 
    items_per_page: number 
    page: number
}


@Injectable({providedIn:"root"})
export class EmployeeService {

    constructor(private employeeApi: EmployeeApi, private authApi: AuthApiService){}

    private _todayScheduleInfo$ = new BehaviorSubject<{schedule: ScheduleType, attendance: AttendanceType} | null>(null)
    private _employees$ = new BehaviorSubject<{employees: EmployeeType[],totalEmployees: number}>({} as any)
    private _filteredEmployees$ = new BehaviorSubject<{employees: EmployeeType[],totalEmployees: number}>({} as any)
    private _selectedEmployeeAttendances$ = new BehaviorSubject<AttendanceDetailType[]>([])
    
    

    httpClient = inject(HttpClient)

    getEmployees(page: number,pageSize: number){
        return this.employeeApi.findEmployees(page,pageSize).pipe(map(data => {
            this._filteredEmployees$.next(data)
            this._employees$.next(data)
            return data
        }))
    }

    filterEmployees(data: Partial<FilterEmployeeType>){

        const employees = this._employees$.value.employees

        const filtered = employees.slice(1,Number(data.items_per_page)).filter(employee =>{
            return employee.first_name.includes(data.first_name ?? "")
        })

        this._filteredEmployees$.next({employees: filtered, totalEmployees: this._employees$.value.totalEmployees})

       

    }

    createEmployee(createEmployee: CreateEmployeeType){
        return this.employeeApi.createEmployee(createEmployee).pipe(map(data => {
            this._employees$.next({employees: [...this._employees$.value.employees, data.employee], totalEmployees: this._employees$.value.totalEmployees + 1})
            return data
        }))
    }

    deleteEmployee(employeeId: number){
        return this.employeeApi.deleteEmployee(employeeId).pipe(map(data => {
            const filteredEmployees = this._employees$.value.employees.filter(employee => employee.id !== employeeId)
            this._employees$.next({...this._employees$.value, employees: filteredEmployees})
            return data
        }))
    }

      changeEmployeePin(employeeId: number, pin: string){
        return this.authApi.changeEmployeePin(employeeId,pin).pipe(map(data => {
            return data
        }))
    }

  
    getSchedulesByEmployeeID(employeeId: number){
        return this.employeeApi.findEmployeeSchedules(employeeId).pipe(map(data => {
            return data
        }))

    }

    getTodaySchedule(employeeId: number){
        return this.employeeApi.findTodayEmployeeSchedule(employeeId).pipe(map(data => {
            this._todayScheduleInfo$.next(data)
            return data
        }))
    }

    onEnterAttendance(enterAttendance: EnterAttendanceType){
        return this.employeeApi.onEnterTodayAttendance(enterAttendance).pipe(map(data => {
            return data
        }))
    }

    onExitAttendance(exitAttendance: ExitAttendanceType){
        return this.employeeApi.onExitTodayAttendance(exitAttendance).pipe(map(data => {
            return data
        }))
    }


    get employees$(){
        return this._employees$.asObservable()
    }

    get filteredEmployees$(){
        return this._filteredEmployees$.asObservable()
    }

    get selectedEmployeeAttendances$(){
        return this._selectedEmployeeAttendances$.asObservable()
    }

    get todayScheduleInfo$ (){
        return this._todayScheduleInfo$.asObservable()
    }



}