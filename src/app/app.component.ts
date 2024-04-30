import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'EmployeeInsurance';
  readonly APIUrl = 'https://localhost:7223/api/Employee';

  constructor(private http: HttpClient, private authService: AuthService) {}
  notes: any = [];

  GetData() {
    this.http.get(this.APIUrl).subscribe((data) => {
      this.notes = data;
      console.log(data);
    });
  }

  ngOnInit() {
    this.GetData();
  }

  logout() {
    this.authService.logout();
  }
  isAuthenticated() {
    return this.authService.isAuthenticated;
  }
}
