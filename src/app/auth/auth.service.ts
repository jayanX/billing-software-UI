import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: boolean = false;

  constructor(private router: Router) {}

  login() {
    this.isAuthenticated = true;
    localStorage.setItem('isLoggedIn', 'true');
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

  checkAuthentication() {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    this.isAuthenticated = loggedInStatus === 'true';
    return this.isAuthenticated;
  }
}
