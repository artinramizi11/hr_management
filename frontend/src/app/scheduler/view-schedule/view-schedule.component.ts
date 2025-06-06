import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { Observable } from 'rxjs';
import { ScheduleType } from '../../types/schedule.type';
import { AsyncPipe, DatePipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterService } from '../../services/router.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-schedule',
  imports: [AsyncPipe,DatePipe],
  templateUrl: './view-schedule.component.html',
  styleUrl: './view-schedule.component.css'
})
export class ViewScheduleComponent implements OnInit {

  constructor(private scheduleService: ScheduleService){
    this.schedule$ = scheduleService.singleSchedule$
  }

  activeModal = inject(NgbActiveModal)
  routerService = inject(RouterService)
  activatedRoute = inject(ActivatedRoute)


  @Input() scheduleId!: number
  schedule$: Observable<ScheduleType>


  ngOnInit(): void {
    this.scheduleService.findScheduleById(this.scheduleId).subscribe()
  }




  onCloseModal(){
    this.activeModal.dismiss()

  }

}
