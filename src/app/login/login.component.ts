import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginForm } from '../type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form: LoginForm = {
    email: '',
    password: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.form.email, this.form.password).subscribe(
      (response) => {
        // Authentication successful
        console.log('Authentication successful:', response);
        this.authService.storeUserDetails(response);
        sessionStorage.setItem('employeeId', response.empId);
        // Redirect to dashboard or any other page
        this.router.navigate(['/dashboard', { id: response.empId }]);
        alert('Login successful');
      },
      (error) => {
        // Authentication failed
        console.error('Authentication failed:', error);
        // Handle error, display message to the user, etc.
        if (error.status === 404) {
          alert('User not found');
        } else if (error.status === 400) {
          alert('Incorrect password');
        } else {
          alert('An error occurred. Please try again later.');
        }
      }
    );
  }

}
