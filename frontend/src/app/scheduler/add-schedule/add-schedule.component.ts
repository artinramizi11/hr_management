import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { EmployeeType, UsersService } from '../../services/users.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScheduleService } from '../../services/schedule.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Calendar, CalendarApi, CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-add-schedule',
  imports: [ReactiveFormsModule],
  templateUrl: './add-schedule.component.html',
  styleUrl: './add-schedule.component.css'
})
export class AddScheduleComponent implements OnInit {

  @Input() date!: Date
  @Input() employee!: EmployeeType
  @Input() calendarApi!: CalendarApi
  addScheduleForm!: FormGroup

  usersService = inject(UsersService)
  scheduleService = inject(ScheduleService)
  authService = inject(AuthService)
  activeModal = inject(NgbActiveModal)


  isSubmitted = signal(false)
  error = signal("")



  ngOnInit(): void {
     this.addScheduleForm = new FormGroup({
    date: new FormControl(this.date),
    starts_at: new FormControl("",[Validators.required]),
    ends_at: new FormControl("",[Validators.required]),
    employee_id: new FormControl(this.employee.id)

  })
    
  }

  onCloseModal(){
    this.activeModal.close()

  }

  async onAddSchedule(){

    this.isSubmitted.set(true)

    if(this.addScheduleForm.valid){

    const {date,employee_id,starts_at, ends_at} = this.addScheduleForm.value

    const startsAtValue = this.transformHourToUTC(starts_at)
    const endsAtValue = this.transformHourToUTC(ends_at)

    this.scheduleService.createSchedule(
      {starts_at: startsAtValue,ends_at: endsAtValue,date,employee_user_id: Number(employee_id),scheduled_by_user_id: this.authService.loggedUser$()?.id ?? 0})
    .subscribe({
      next:(data) => {

        this.calendarApi.addEvent({
          date: data.date,
          start: data.starts_at,
          end: data.ends_at,
          resourceId: String(data.employee_user.id),
        })

        this.onCloseModal()
      },
      error: (err) => {
       this.error.set(err.error.message)
      }
    })

    }

  }

  transformHourToUTC(value: string){
    const [hours,minutes] = value.split(":")
    const date = new Date(this.date)
     date.setUTCHours(Number(hours),Number(minutes),0,0)
    return date.toISOString()

  }

}
