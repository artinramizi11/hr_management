import { NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { CreateEmployeeType } from '../../../types/create-employee.type';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent {

  employeeService = inject(EmployeeService)
  activeModal = inject(NgbActiveModal)

  error = signal("")
  message = signal("")


  addEmployeeForm = new FormGroup({
    email: new FormControl("",[Validators.required,Validators.email]),
    first_name: new FormControl("",[Validators.required]),
    last_name: new FormControl("",[Validators.required]),
    pin: new FormControl("",[Validators.required,Validators.minLength(6),Validators.maxLength(6)])
  })

  onAddEmployee(){
   if(this.addEmployeeForm.valid){
    this.employeeService.createEmployee({...this.addEmployeeForm.value as CreateEmployeeType}).subscribe({
      next: (data) => {
        this.error.set("")
        this.message.set(data.message)
        setTimeout(() => {
          this.activeModal.dismiss()
        }, 500);
      },
      error: (err) => {
        this.message.set("")
        this.error.set(err?.error?.message)
      }
    })
    
   }
    
  }

}
