import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ManagerType } from "../services/users.service";

@Injectable({providedIn:"root"})
export class AuthApiService {

    httpClient = inject(HttpClient)

    login(pin: string){
        return this.httpClient.post<{message: string, token: string}>("http://localhost:3000/auth/login", {pin})
    }

    changeEmployeePin(employeeId: number,pin: string){
        return this.httpClient.post<{message: string}>(`http://localhost:3000/auth/employees/${employeeId}/change-pin`, {pin})
    }

    changeManagerPin(managerId: number, pin: string){
        return this.httpClient.post<{message: string, manager: ManagerType}>(`http://localhost:3000/auth/managers/${managerId}/change-pin`, {pin})

    }
    
}