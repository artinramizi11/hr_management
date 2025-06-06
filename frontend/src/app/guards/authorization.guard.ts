import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({providedIn:"root"})
export class AuthorizationGuard implements CanActivate {

    constructor(private authService: AuthService){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        const requiredRoles = route.data['roles']

        if(!requiredRoles) return true

        const loggedUser = this.authService.loggedUser$()

        if(loggedUser?.scope === 'global'){
            const hasRequiredRole = requiredRoles.some((r: string) => loggedUser.role.includes(r))
            return hasRequiredRole
        }



        return false
        
    }
}