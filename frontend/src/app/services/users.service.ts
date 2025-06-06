import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";
import {  } from "../types/schedule.type";
import { AttendanceType } from "../types/attendance.type";
import { UsersApi } from "../api/users-api";
import { GeneralStatsType } from "../home-page/home-page.component";



export type ManagerType = {
    id: number 
    username: string 
    role: string 
    scope: string 
    created_at: Date
}

export type EmployeeType = {
    id: number 
    email: string 
    first_name: string 
    last_name: string
    created_at: Date
}

export type AttendanceDetailType = {
    id: number;
    date: string;
    starts_at: string;
    ends_at: string;
    attendance: AttendanceType
}

@Injectable({providedIn:"root"})
export class UsersService {

    constructor(private usersApi: UsersApi){}

    private _usersStats$ = new BehaviorSubject({} as GeneralStatsType)

    findUsersStatistics(){
        return this.usersApi.findUsersStatistics().pipe(map(data => {
            this._usersStats$.next(data)
            return data
        }))

    }

    get usersStats$ (){
        return this._usersStats$.asObservable()
    }



   

    
}