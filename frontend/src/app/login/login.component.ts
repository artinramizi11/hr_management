import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router)

  pin = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ],
  });

  ngOnInit(): void {
    if(this.authService.isLoggedUser()){
      this.router.navigate(['home-page'])
    }
    this.pin.valueChanges
      .pipe(distinctUntilChanged(),debounceTime(150))
      .subscribe((value) => {
        if (this.pin.invalid) return;
        this.authService.login(value).subscribe({
          next: (data) => {
            console.log(data)
          },
        error: (err) => {
          this.pin.setValue("")

        }
      })
        
      });
  }


}
