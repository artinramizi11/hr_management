import { Component, inject, Input, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ManagerType } from '../../../services/users.service';
import { ManagerService } from '../../../services/manager.service';

@Component({
  selector: 'app-confirm-delete-manager',
  imports: [],
  templateUrl: './confirm-delete-manager.component.html',
  styleUrl: './confirm-delete-manager.component.css'
})
export class ConfirmDeleteManagerComponent {

  @Input() manager!: ManagerType

  activeModal = inject(NgbActiveModal)
  managerService = inject(ManagerService)

  error = signal("")
  successMessage = signal("")

  onDelete(){
    this.managerService.deleteManager(this.manager.id).subscribe({
      next: (data) => {
        this.error.set("")
        this.successMessage.set(data.message)
        setTimeout(() => {
          this.activeModal.dismiss()
        }, 500);

      },
      error: (err) => {
        this.error.set(err?.error?.message)
        this.successMessage.set("")
      }
    })

  }

  onCancel(){

  }
}
