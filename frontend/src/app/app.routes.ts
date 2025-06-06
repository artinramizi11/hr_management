import { Routes } from '@angular/router';
import { EmployeePageComponent } from './employee-page/employee-page.component';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ManagersComponent } from './home-page/managers/managers.component';
import { EmployeesComponent } from './home-page/employees/employees.component';
import { UserAttendanceDetailComponent } from './home-page/employees/user-attendance-detail/user-attendance-detail.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { AuthorizationGuard } from './guards/authorization.guard';
import { AuthGuard } from './guards/auth.guard';

export enum Role {
    Admin = 'admin',
    Manager = 'manager'
}

export const routes: Routes = [
    {
        path:"",
        redirectTo: 'home-page',
        pathMatch:"full"

    },
    {
        path:"login",
        component:LoginComponent

    },
    {
        path:"employee-page",
        component: EmployeePageComponent,
        canActivate: [AuthGuard]

},
{
    path:"home-page",
    component: HomePageComponent,
    canActivate: [AuthGuard,AuthorizationGuard],
    data: {
        roles: ["admin"]
    }
    
},
 {
    path:"managers",
    component: ManagersComponent,
    canActivate: [AuthGuard,AuthorizationGuard],
    data: {
        roles: ["admin"]
    }
},
{
    path:"all-employees",
    component: EmployeesComponent,
    canActivate: [AuthGuard,AuthorizationGuard  ],
    data: {
        roles: ["admin","manager"]
    }
},
{
    path:"all-employees/:employeeId/attendances",
    component: UserAttendanceDetailComponent,
    canActivate: [AuthGuard,AuthorizationGuard],
    data: {
        roles:["admin","manager"]
    }
},
{
    path:"scheduler",
    component: SchedulerComponent,
    canActivate: [AuthGuard,AuthorizationGuard],
    data: {
        roles:["admin","manager"]
    }
}

];
