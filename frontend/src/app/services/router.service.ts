import { inject, Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs";

@Injectable({providedIn:"root"})
export class RouterService {

    router = inject(Router)

    onNavigate(link: string){
        this.router.navigate([link])
    }

    setParams(activatedRoute: ActivatedRoute, params: any){
        this.router.navigate([], {queryParams: params, relativeTo: activatedRoute})
    }
    
   
}