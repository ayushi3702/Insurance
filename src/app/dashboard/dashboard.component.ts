import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Emp, Policy } from '../type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  readonly EmployeeAPIUrl = 'https://localhost:7223/api/Employee';
  readonly PolicyAPIUrl = 'https://localhost:7223/api/Policy';

  constructor(private http: HttpClient, private toastr: ToastrService, private route: Router) {}
  emp: any = {};
  policies: any = {};
  employeeId: string | null = null;

  GetEmpData(id: number) {
    this.http.get<Emp[]>(`${this.EmployeeAPIUrl}/${id}`).subscribe(
      (data) => {
        this.emp = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching employee data:', error);
        this.toastr.error('Error fetching employee data', 'Error');
      }
    );
  }

  GetPolicyData(id: number) {
    // this.http.get(`${this.APIUrl1}/${id}`).subscribe((data) => {
    //   this.policy = data;
    //   console.log(data);
    // });
    this.http.get<Policy[]>(`${this.PolicyAPIUrl}/${id}`).subscribe(
      (data) => {
        this.policies = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching policy data:', error);
        this.toastr.error('Error fetching policy data', 'Error');
      }
    );
  }

  ngOnInit() {
    const userId = sessionStorage.getItem('employeeId');
    console.log(userId);
    if (userId) {
      const id = parseInt(userId, 10);
      this.GetEmpData(id);
      this.GetPolicyData(id);
    } else {
      console.error('User ID not found in session storage');
      this.toastr.error('User ID not found in session storage', 'Error');
    }
  }

  GoTopayment() {
    this.route.navigate(['/payment']);
  }
}
