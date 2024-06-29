import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username:string='';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'Guest'; // Default role is Guest,
  


  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    this.authService.signup(this.username,this.email, this.password,this.role).subscribe(
      res => {
        console.log('Signup successful', res);
        this.router.navigate(['/login']);
        console.log(this.username,this.email,this.password,this.role)
      },
      err => {
        console.error('Signup error', err);
      }
    );
  }
}
