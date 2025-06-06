import { HttpHandlerFn, HttpRequest } from "@angular/common/http";

export const JwtInterceptor = (req: HttpRequest<any>, next: HttpHandlerFn) => {

    const token = localStorage.getItem("token")

    if(token){
        const newReq = req.clone({
            headers: req.headers.set("Authorization", `Bearer ${token}`)
        })
        return next(newReq)
    }

    return next(req)

}