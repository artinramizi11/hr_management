import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ManagerType } from "../services/users.service";
import { CreateManagerType } from "../types/create-manager.type";
import { map } from "rxjs";

@Injectable({providedIn:"root"})
export class ManagerApi {

    httpClient = inject(HttpClient)
    

      findManagers(page: number, pageSize: number){
        return this.httpClient.get<ManagerType[]>(`http://localhost:3000/users/managers?page=${page}&pageSize=${pageSize}`)
    }

    createManager(createManager: CreateManagerType){
      return this.httpClient.post<{message: string, user: ManagerType}>("http://localhost:3000/users", createManager)

    }

    deleteManager(id: number){
      return this.httpClient.delete<{message: string, manager: ManagerType}>(`http://localhost:3000/users/${id}`)
    }


}