import { Component, inject, Input, signal } from '@angular/core';
import { EmployeeType } from '../../../services/users.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-confirm-delete',
  imports: [],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.css'
})
export class ConfirmDeleteComponent {

  @Input() employee!: EmployeeType

  activeModal = inject(NgbActiveModal)
  employeeService = inject(EmployeeService)

  successMessage = signal("")
  error = signal("")

  onCancel(){
    this.activeModal.dismiss()

  }

  onDelete(){
    this.employeeService.deleteEmployee(this.employee.id).subscribe({
      next: (data) => {
        this.successMessage.set(data.message)
        this.error.set("")
        setTimeout(() => {
          this.activeModal.dismiss()
          window.location.reload()
        }, 1000);
      },
      error: (err) => {
        this.error.set(err?.error?.message)
        this.successMessage.set("")

      }
    })

  }

}
