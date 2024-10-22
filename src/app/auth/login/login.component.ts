import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  isSignDivVisiable: boolean  = true;

  signUpObj: SignUpModel  = new SignUpModel();
  loginObj: LoginModel  = new LoginModel();

  constructor( private router: Router){}

  onRegister() {
    const localUser = localStorage.getItem('angular17users');
    if(localUser != null) {
      const users = JSON.parse(localUser);
      users.push(this.signUpObj);
      localStorage.setItem('angular17users', JSON.stringify(users));
    } else {
      const users = [];
      users.push(this.signUpObj);
      localStorage.setItem('angular17users', JSON.stringify(users));
    }
    alert('Registration Success');
  }

  onLogin() {
    if (this.loginObj.email === 'admin@gmail.com' && this.loginObj.password === 'admin') {
      alert("User Found...");
      // this.authService.login(); // Set the authentication status
      this.router.navigateByUrl('/dashboard');
    } else {
      alert("No User Found");
    }
  }
}



export class SignUpModel  {
  name: string;
  email: string;
  password: string;

  constructor() {
    this.email = "";
    this.name = "";
    this.password= ""
  }
}

export class LoginModel  { 
  email: string;
  password: string;

  constructor() {
    this.email = ""; 
    this.password= ""
  }
}