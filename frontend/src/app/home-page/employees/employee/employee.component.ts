import { Component, inject, Input } from '@angular/core';
import { EmployeeType } from '../../../services/users.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  imports: [DatePipe],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {

  @Input() employee!: EmployeeType

  router = inject(Router)

 

}
