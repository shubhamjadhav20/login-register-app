import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe(
      res => {
        console.log('Login successful', res);
        localStorage.setItem('token', res.token); // Store the token in localStorage
        console.log(localStorage)
        this.router.navigate(['/landing']); // Navigate to the landing page
      },
      err => {
        console.error('Login error', err);
      }
    );
  }
}
