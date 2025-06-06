import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { EmployeeType, UsersService } from '../../services/users.service';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, debounceTime, map, Observable, Subject } from 'rxjs';
import { EmployeeService, FilterEmployeeType } from '../../services/employee.service';
import { Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule, NgbPagination, NgbPaginationPages } from '@ng-bootstrap/ng-bootstrap';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { ChangePinComponent } from './change-pin/change-pin.component';
import { RouterService } from '../../services/router.service';


@Component({
  selector: 'app-employees',
  imports: [AsyncPipe, DatePipe, ReactiveFormsModule, NgbPagination,ReactiveFormsModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit,AfterViewInit {

  @ViewChild(NgbPagination) paginationRef!: NgbPagination

  constructor(private employeeService: EmployeeService){
    this.employeesList$ = this.employeeService.employees$
    this.filteredEmployeeList$ = this.employeeService.filteredEmployees$
  }


  usersService = inject(UsersService)
  routerService = inject(RouterService)
  activatedRoute = inject(ActivatedRoute)
  modalService = inject(NgbModal)

  currentPage = 1

  searchForm = new FormGroup({
    first_name: new FormControl("", {nonNullable: true}),
    items_per_page: new FormControl(6, {nonNullable: true}),
    page: new FormControl(1, {nonNullable: true})
  })

   employeesList$: Observable<{employees: EmployeeType[],totalEmployees: number}>
  filteredEmployeeList$: Observable<{employees: EmployeeType[],totalEmployees: number}>


  ngAfterViewInit(): void {
    this.currentPage = this.searchForm.controls.page.value
  }

  ngOnInit(): void {

    const { first_name , items_per_page , page } =  this.searchForm.value

    this.employeeService.getEmployees(page!, items_per_page!).subscribe({
      next: () => {

          this.searchForm.valueChanges.subscribe({next: (data) => {

      this.employeeService.filterEmployees(data)
      this.routerService.setParams(this.activatedRoute, {page: data.page || null, pageItems: data.items_per_page || null, firstName: data.first_name || null})

    }})
      }
    })


  }

    onViewAttendances(id: number){
    this.routerService.onNavigate(`/all-employees/${id}/attendances`)
  }

    onEditEmployee(employee: EmployeeType){
     const ref = this.modalService.open(EditEmployeeComponent)
     ref.componentInstance.employee = employee
    
  }

   onAddEmployee(){
    this.modalService.open(AddEmployeeComponent)
    
  }

  onDelete(employee: EmployeeType){
    const ref = this.modalService.open(ConfirmDeleteComponent)
    ref.componentInstance.employee = employee
  }

  onChangePin(employee: EmployeeType){
    const ref = this.modalService.open(ChangePinComponent)
    ref.componentInstance.employee = employee
  }




  onPageChange(page: number){
    this.searchForm.controls.page.setValue(page)
    this.employeeService.getEmployees(page,this.searchForm.controls.items_per_page.value).subscribe()
  }





}
