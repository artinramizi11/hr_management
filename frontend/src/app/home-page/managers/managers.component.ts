import { Component, inject, OnInit, signal } from '@angular/core';
import { ManagerType, UsersService } from '../../services/users.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterManagersType, ManagerService } from '../../services/manager.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { RouterService } from '../../services/router.service';
import { AddManagerComponent } from './add-manager/add-manager.component';
import { ConfirmDeleteManagerComponent } from './confirm-delete-manager/confirm-delete-manager.component';
import { ChangeManagerPinComponent } from './change-manager-pin/change-manager-pin.component';

@Component({
  selector: 'app-managers',
  imports: [AsyncPipe,DatePipe,NgbPagination,ReactiveFormsModule],
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.css'
})
export class ManagersComponent implements OnInit {

  constructor(private managerService: ManagerService){
    this.filteredManagerList$ = this.managerService.filteredManagerList$
    this.loading$ = this.managerService.loading$
  }

  routerService = inject(RouterService)
  modalService = inject(NgbModal)

  searchFilter = new FormGroup({
    page: new FormControl(1,{
      nonNullable: true,
      validators: []
    }),
    pageSize: new FormControl(6, {
      nonNullable: true,
      validators: []
    }),
    searchText: new FormControl("", {nonNullable: true})
  })

  filteredManagerList$: Observable<ManagerType[]>
  loading$: Observable<boolean>

  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)

 
  ngOnInit(): void {


   this.managerService.getManagers(1,6).subscribe({
    next: () => {
      this.searchFilter.valueChanges.subscribe({next: (data) => {
        console.log("hello")
        const { page, pageSize, searchText } = data
          this.managerService.filterManagers({page: page!, pageSize: pageSize!, searchText: searchText!})
          this.routerService.setParams(this.activatedRoute,{page: page || null, items_per_page: pageSize || null, username: searchText || null})

      }})
    }
   })
  }

  onPageChange(page: number){
    this.searchFilter.controls.page.setValue(page)
    this.managerService.getManagers(page,this.searchFilter.controls.pageSize.value).subscribe()
  }

  onAddManager(){
    this.modalService.open(AddManagerComponent)

  }

  onDeleteManager(manager: ManagerType){
   const ref =  this.modalService.open(ConfirmDeleteManagerComponent)
   ref.componentInstance.manager = manager
  }

  onChangePin(manager: ManagerType){
    const ref = this.modalService.open(ChangeManagerPinComponent)
    ref.componentInstance.manager = manager 
  }


}
