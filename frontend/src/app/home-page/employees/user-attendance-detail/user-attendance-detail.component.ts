import { Component, inject, OnInit } from '@angular/core';
import { AttendanceDetailType, UsersService } from '../../../services/users.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ScheduleService } from '../../../services/schedule.service';

@Component({
  selector: 'app-user-attendance-detail',
  imports: [AsyncPipe,DatePipe],
  templateUrl: './user-attendance-detail.component.html',
  styleUrl: './user-attendance-detail.component.css'
})
export class UserAttendanceDetailComponent implements OnInit {

  constructor(private scheduleService: ScheduleService){
    this.singleEmployeeSchedules$  = this.scheduleService.selectedSchedulesAttendances$

  }

  authService = inject(AuthService)
  activatedRoute = inject(ActivatedRoute)

  singleEmployeeSchedules$: Observable<AttendanceDetailType[]>

  ngOnInit() {
    const { employeeId } = this.activatedRoute.snapshot.params

    if(employeeId){
          this.scheduleService.findEmployeeSchedules(employeeId).subscribe({next:(data) => console.log(data)})
    }

   
   
    

  }

}
