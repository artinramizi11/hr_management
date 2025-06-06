import { Injectable } from "@angular/core";
import { BehaviorSubject, map, tap } from "rxjs";
import { ManagerType } from "./users.service";
import { ManagerApi } from "../api/manager-api";
import { CreateManagerType } from "../types/create-manager.type";
import { AuthApiService } from "../api/auth-api";

export type FilterManagersType = {
    page: number
    pageSize: number
    searchText: string
}

@Injectable({providedIn:"root"})
export class ManagerService {

    constructor(private managerApi: ManagerApi, private authApi: AuthApiService){}

    private _managerList$ = new BehaviorSubject<ManagerType[]>([])
    private _filteredManagerList$ = new BehaviorSubject<ManagerType[]>([])
    private _loading$ = new BehaviorSubject<boolean>(true)

    getManagers(page: number,pageSize: number){
        return this.managerApi.findManagers(page,pageSize).pipe(
            map(data => {
            this._managerList$.next(data)
            this._filteredManagerList$.next(data)
            return data
        }),
        tap(() => this._loading$.next(false))
    )

    }

    createManager(manager: CreateManagerType){
        return this.managerApi.createManager(manager).pipe(map(data => {
            this._managerList$.next([...this._managerList$.value, data.user])
            this._filteredManagerList$.next([...this._filteredManagerList$.value, data.user])
            return data
        }))
    }

    deleteManager(id: number){
        return this.managerApi.deleteManager(id).pipe(map(data => {
            const filtered = this._managerList$.value.filter(manager => manager.id !== id)
            this._managerList$.next(filtered)
            this._filteredManagerList$.next(filtered)
            return data
        }))
    }

    filterManagers(data: Partial<FilterManagersType>){
        const { pageSize , searchText } = data
        const managers = this._managerList$.value
        const filtered = managers.slice(1,Number(pageSize)).filter(manager => {
            return manager.username.includes(data.searchText ?? "")
        })
        this._filteredManagerList$.next(filtered)

        }

        changeManagerPin(managerId: number, pin: string){
            return this.authApi.changeManagerPin(managerId,pin).pipe(map(data => {
                return data
            }))
        }
 
    


    get managerList$ (){
        return this._managerList$.asObservable()
    }

    get loading$ (){
        return this._loading$.asObservable()
    }

    get filteredManagerList$ (){
        return this._filteredManagerList$.asObservable()
    }


}