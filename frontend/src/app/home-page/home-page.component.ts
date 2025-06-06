import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { UsersService } from '../services/users.service';

export type GeneralStatsType = {
  totalUsers: number 
  totalAdmins: number
  totalManagers: number
  totalEmployees: number
}

@Component({
  selector: 'app-home-page',
  imports: [AsyncPipe],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit  {

  authService = inject(AuthService)

  constructor(private usersService: UsersService){
    this.usersStats$ = usersService.usersStats$
  }

  usersStats$: Observable<GeneralStatsType>

  ngOnInit(): void {
    this.usersService.findUsersStatistics().subscribe()
    console.log(this.authService.loggedUser$())
    console.log(this.authService.isLoggedUser())
  }

 
    
  }

 

