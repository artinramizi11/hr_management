import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { EmployeeService } from '../services/employee.service';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ScheduleType } from '../types/schedule.type';
import { AttendanceType } from '../types/attendance.type';

@Component({
  selector: 'app-employee-page',
  imports: [AsyncPipe],
  templateUrl: './employee-page.component.html',
  styleUrl: './employee-page.component.css'
})
export class EmployeePageComponent implements OnInit {

  constructor(private employeeService: EmployeeService){
    this.todayScheduleInfo$ = this.employeeService.todayScheduleInfo$
  }

  authService = inject(AuthService)
  router = inject(Router)

  message = signal("")
  addingAttendance = signal(false)


  todayScheduleInfo$: Observable<{schedule: ScheduleType, attendance: AttendanceType} | null>

  ngOnInit(): void {
   this.todayScheduleInfo$.subscribe({next: (data) => console.log(data)})
    if(!this.authService.loggedUser$()){
      this.router.navigate(['login'])
    }
    const employeeId = this.authService.loggedUser$()?.id
   if(employeeId){
    this.employeeService.getTodaySchedule(employeeId).subscribe()
   }
  }



 onEnterAttendance() {

  this.employeeService.onEnterAttendance({
    date: new Date(),
    entered_at: new Date().toUTCString(),
    employee_user_id: this.authService.loggedUser$()!.id
  }).subscribe({
    next: (data) => {
      this.addingAttendance.set(true)
      this.message.set(data.message)
      setTimeout(() => {
       this.authService.logout()
      }, 1000);
    }
  });
}


  onExitAttendance(){
    this.employeeService.onExitAttendance({
      date: new Date(),
      exited_at: new Date().toUTCString(),
      employee_user_id: this.authService.loggedUser$()!.id
    }).subscribe({
      next: (data) => {
        this.addingAttendance.set(true)
        this.message.set(data.message)
        setTimeout(() => {
        this.authService.logout()
        }, 1000);
      }
    })

  }

}
