import { Component, inject, Input } from '@angular/core';
import { EmployeeType } from '../../../services/users.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-employee',
  imports: [],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent {

  activeModal = inject(NgbActiveModal)

  @Input() employee!: EmployeeType

  onClose(){
    this.activeModal.dismiss()

  }

}
