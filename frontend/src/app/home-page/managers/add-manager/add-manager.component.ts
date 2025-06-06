import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ManagerService } from '../../../services/manager.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-manager',
  imports: [ReactiveFormsModule],
  templateUrl: './add-manager.component.html',
  styleUrl: './add-manager.component.css'
})
export class AddManagerComponent {

  managerService = inject(ManagerService)
  activeModal = inject(NgbActiveModal)

  error = signal("")
  message = signal("")

  addManagerForm = new FormGroup({
    username: new FormControl("",
      {
        nonNullable: true,
        validators: [Validators.required]
      }
    ),
    role: new FormControl("manager", {
      nonNullable: true
    }),
    pin: new FormControl("", 
      {
        nonNullable: true,
        validators: [Validators.required,Validators.minLength(6),Validators.maxLength(6)]
      }
    )

  })

  onAddManager(){
    if(this.addManagerForm.valid){
      const { username , role , pin } = this.addManagerForm.getRawValue()
      this.managerService.createManager({username,role,pin}).subscribe({
        next: (data) => {
          this.error.set("")
          this.message.set(data.message)
          setTimeout(() => {
            this.activeModal.dismiss()
          }, 500);
        },
        error: (err) => {
          this.error.set(err?.error?.message)
          this.message.set("")
        }
      })
      
    }

  }
}
