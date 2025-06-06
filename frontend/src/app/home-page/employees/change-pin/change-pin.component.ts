import { Component, inject, Input, signal } from '@angular/core';
import { EmployeeType } from '../../../services/users.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { EmployeeService } from '../../../services/employee.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-pin',
  imports: [ReactiveFormsModule],
  templateUrl: './change-pin.component.html',
  styleUrl: './change-pin.component.css'
})
export class ChangePinComponent {

  @Input() employee!: EmployeeType


  employeeService = inject(EmployeeService)
  activeModal = inject(NgbActiveModal)

  changePinForm = new FormGroup({
    newPin: new FormControl("",[Validators.required,Validators.minLength(6),Validators.maxLength(6)] ),
    sameNewPin: new FormControl("",[Validators.required,Validators.minLength(6),Validators.maxLength(6)])
  })

  sucessMessage = signal("")
  errorMessage = signal("")

  onChangePin(){
    if(this.changePinForm.valid){
      const { newPin,sameNewPin } = this.changePinForm.controls
      const samePins = newPin.value === sameNewPin.value

      if(!samePins) {
        console.log("hello")
        this.errorMessage.set("Both PINS needs to be same")
      }

      this.employeeService.changeEmployeePin(this.employee.id, newPin.value!).subscribe(
        {
          next: (data) => {
        
        this.sucessMessage.set(data.message)
        this.errorMessage.set("")
        setTimeout(() => {
          this.activeModal.dismiss()
          
        }, 1000);
      },
      error: (err) => {
        console.log("error",err)
        this.errorMessage.set(err?.error?.message)
        this.sucessMessage.set("")
      }
    })


      
      
    }
    
  }



}
