import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ManagerType } from "../services/users.service";
import { GeneralStatsType } from "../home-page/home-page.component";

@Injectable({providedIn:"root"})
export class UsersApi {

    httpClient = inject(HttpClient)

    findUsersStatistics(){
        return this.httpClient.get<GeneralStatsType>("http://localhost:3000/users/general-stats")
    }
    



}