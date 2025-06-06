import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  authService = inject(AuthService)

  router = inject(Router)
 
  ngOnInit(): void {
    if(!this.authService.loggedUser$() && this.authService.isLoggedUser()){
      this.router.navigate(['login'])
    }
  }

  onLogOut(){
    this.authService.logout()
  }

 
}


