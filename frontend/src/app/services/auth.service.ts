import { inject, Injectable, signal } from "@angular/core";
import { map } from "rxjs";
import { Router } from "@angular/router";
import { AuthApiService } from "../api/auth-api";
import { JwtHelperService } from "@auth0/angular-jwt"

export type UserPayload = { id: number, scope: 'global' | 'employee', role: string }
export type EmployeeUserPayload = { id: number, scope: 'employee', role?: string}
export type JwtPayload = {id: number, scope: 'employee' | 'global', role?: string, iat: number, exp: number}

@Injectable({providedIn:"root"})
export class AuthService {

    constructor(private authApi: AuthApiService){}

    private _loggedUser = signal<UserPayload | EmployeeUserPayload | null>(this.getLoggedUser())

    router = inject(Router)

    login(pin: string){
        return this.authApi.login(pin).pipe(map(data => {
            localStorage.setItem("token", data.token)
        
          this.validateAndRedirect(data.token)
          
          return data

        }))
      
    }


    getLoggedUser() {
        const token = localStorage.getItem("token")
       if(token){
         const helper = new JwtHelperService()
        const decoded = helper.decodeToken(token)
        return {
            id: decoded.id,
            scope: decoded.scope,
            role: decoded.role

        }
       }
       return null

    }

    isLoggedUser(){
        const token = localStorage.getItem("token")
        if(token){
            const helper = new JwtHelperService()
            const isExpired = helper.isTokenExpired(token)
           
            return !isExpired

        }
        return false
    }

     logout(){
        localStorage.removeItem("token")
        this._loggedUser.set(null)
        this.router.navigate(['login'])
        window.location.reload()
    }

      validateAndRedirect(token: string){
        const helper = new JwtHelperService()
        const decodedToken = helper.decodeToken<JwtPayload>(token)
        if(decodedToken?.scope === 'employee'){
            this._loggedUser.set({id: decodedToken.id, scope:"employee"})
            this.router.navigate(['employee-page'])
        }
        if(decodedToken?.scope === 'global'){
            this._loggedUser.set({id: decodedToken.id, scope:"global", role:decodedToken.role ?? ""})
            if(decodedToken.role === 'admin'){
                this.router.navigate(['home-page'])
            }
            if(decodedToken.role === 'manager'){
                this.router.navigate(['all-employees'])
            }
        }
    }


    get loggedUser$(){ 
        return this._loggedUser
    }
 
  



}