import { Component, inject, Input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ManagerType } from '../../../services/users.service';
import { ManagerService } from '../../../services/manager.service';

@Component({
  selector: 'app-change-manager-pin',
  imports: [ReactiveFormsModule],
  templateUrl: './change-manager-pin.component.html',
  styleUrl: './change-manager-pin.component.css'
})
export class ChangeManagerPinComponent {

  @Input() manager!: ManagerType

  sucessMessage = signal("")
  errorMessage = signal("")

  managerService = inject(ManagerService)

  changePinForm = new FormGroup({
    newPin: new FormControl("",
      {
        validators: [],
        nonNullable: true,
      }
    ),
    sameNewPin: new FormControl("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)
      ]
    })
  })

  onChangePin(){
    if(this.changePinForm.valid){
      const { newPin, sameNewPin } = this.changePinForm.getRawValue()
      
      const samePINS = newPin === sameNewPin

      if(!samePINS){
        this.errorMessage.set("Both PINS needs to be same")
      }
      this.managerService.changeManagerPin(this.manager.id, newPin).subscribe({
        next: (data) => {
          this.errorMessage.set("")
          this.sucessMessage.set(data.message)
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message)
          this.sucessMessage.set("")
        }
      })


    }
  }

}
