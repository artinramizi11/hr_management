import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { CalendarOptions, EventMountArg, EventSourceInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { ScheduleService } from '../services/schedule.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddScheduleComponent } from './add-schedule/add-schedule.component';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ScheduleType } from '../types/schedule.type';
import { EmployeeService } from '../services/employee.service';
import { ViewScheduleComponent } from './view-schedule/view-schedule.component';

@Component({
  selector: 'app-scheduler',
  imports: [FullCalendarModule, CommonModule],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.css',
})
export class SchedulerComponent implements OnInit,AfterViewInit {

  constructor(private scheduleService: ScheduleService, private employeeService: EmployeeService){
  }

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  sendingReminderMail = signal(false)

 sortEmployees = new BehaviorSubject({currentPage: 1,employeeSize: 3})


  modalService = inject(NgbModal);

  calendarOptions: CalendarOptions = {
    initialView: 'resourceTimeGridWeek',
    themeSystem:"standard",
    plugins: [interactionPlugin, resourceTimeGridPlugin],
    timeZone: 'utc',
    eventDidMount: (data) => {
       const deleteButton = document.createElement('button');
  deleteButton.innerText = 'DELETE';
  deleteButton.className = 'fc-event-delete-box btn btn-danger';

   const viewButton = document.createElement('button');
  viewButton.innerText = 'View';
  viewButton.className = 'fc-event-view-box btn btn-dark';

  deleteButton.addEventListener("click", () => {
    this.onRemoveSchedule(data)
  })

  viewButton.addEventListener("click", () => {
    console.log(data.event)
    const ref = this.modalService.open(ViewScheduleComponent)
    ref.componentInstance.scheduleId = Number(data.event._def.defId)
  })
  
  data.el.appendChild(deleteButton);
  data.el.appendChild(viewButton)
  
    },
    dateClick: (data) => {
      console.log(data)
      const ref = this.modalService.open(AddScheduleComponent);
      ref.componentInstance.date = data.date;
      ref.componentInstance.employee =
        data.resource?._resource?.extendedProps['employee'];
      ref.componentInstance.calendarApi = this.calendarComponent.getApi()
    },
  headerToolbar: {
  left: 'customPrev,customNext', 
  center: 'title',
},
  customButtons: {
    customPrev: {
      text: 'Previous Employee',
      click: () => {
        const currentPage = this.sortEmployees.value.currentPage
       
        if(currentPage > 1){
          this.sortEmployees.next({
            currentPage: currentPage - 1,
            employeeSize: 3
          })
        }
      }
    },
    customNext: {
      text: 'Next Employee',
      click: () => {
        const currentPage = this.sortEmployees.value.currentPage
        this.sortEmployees.next({
          currentPage: currentPage + 1,
          employeeSize: 3
        })
      }
    }
  },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    },
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    },
  };


ngAfterViewInit(): void {
  const calendar = this.calendarComponent.getApi();

  this.sortEmployees.subscribe({
    next: (sortValues) => {
      
      calendar.setOption('resources', []);
      calendar.setOption("events", [])
      

      this.employeeService.getEmployees(sortValues.currentPage, sortValues.employeeSize).subscribe({
        next: (data) => {
         
          const newResources = data.employees.map(employee => ({
            id: String(employee.id),
            title: `${employee.first_name} ${employee.last_name}`,
            extendedProps: {
        employee: employee
      }
            
          }));

          calendar.setOption('resources', newResources);
        }
      });

      this.scheduleService.getSchedules().subscribe({next: (data) => {
        const events: EventSourceInput = data.map(schedule => ({
          date: schedule.date,
          start: schedule.starts_at,
          end: schedule.ends_at,
          resourceId: String(schedule.employee_user.id),
          id: String(schedule.id)
        }))
        calendar.setOption("events", events)
      }})
    }
  });
}


  onRemoveSchedule(eventData: EventMountArg){
    this.scheduleService.removeSchedule(Number(eventData.event.id)).subscribe({
      next: (data) => {
        eventData.event.remove()
      },
      error: (err) => {
        alert(err.error.message)
      },
     
    })
    

  }

  onSendMailForWeek(){
    this.sendingReminderMail.set(true)
      const calendar = this.calendarComponent.getApi();

      const { currentStart, currentEnd } = calendar.view

      this.scheduleService.sendWeeklyReminder({start_day:currentStart.toUTCString(),end_day: currentEnd.toUTCString()}).subscribe({
        
        next: (data) => {
          alert(data.message)
        },
        error: (err) => {
          alert(err?.error?.message)
          this.sendingReminderMail.set(false)
        },
        complete: () => {
          this.sendingReminderMail.set(false)
        }
      })
    

  }





  ngOnInit(): void {



    this.sortEmployees.next({currentPage: 1, employeeSize: 3})

    // this.employeeService.getEmployees(1,5).subscribe({
    //   next:(data) => {
    //     data.employees.map(employee => {
    //       calendarApi.addResource({
    //         id: String(employee.id),
    //         title:employee.first_name + " " + employee.last_name,
    //       })
    //     })
        
    //   }
    // })


//     this.sortEmployees.asObservable().subscribe({next: (pageValue) => {
      
// //  this.scheduleService.getSchedules().subscribe({
// //       next: (data) => {
// //         console.log(data,"data")

// //         const calendar = this.calendarComponent.getApi();

// //         calendar.removeAllEvents()


// // const startIndex = (pageValue.currentPage - 1) * this.sortEmployees.value.employeeSize;
// // const endIndex = startIndex + this.sortEmployees.value.employeeSize;

// // const sort = data.slice(startIndex, endIndex);


// //         const newResources = sort.map(schedule => ({
// //   id: String(schedule.employee_user.id),
// //   title: schedule.employee_user.first_name,
// //   extendedProps: {
// //     employee: schedule.employee_user,
// //   },
// // }));

// // calendar.setOption('resources', newResources);

// // const events = sort.map(schedule => ({
// //    title: 'Scheduled',
// //             start: new Date(schedule.starts_at.toISOString()),
// //             end: new Date(schedule.ends_at.toISOString()),
// //             resourceId: String(schedule.employee_user.id),
// // }))

// // calendar.setOption("events", events)

// // calendar.render()


      
// //       },
// //     });
// //     }})
   
  }
}
