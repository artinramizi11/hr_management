import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({providedIn:"root"})
export class AuthGuard implements CanActivate {


    constructor(private authService: AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
       const isLogged = this.authService.isLoggedUser()

       if(isLogged){
        return true 
       }

       this.router.navigate(['login'])
       return false
       
        
    }
}