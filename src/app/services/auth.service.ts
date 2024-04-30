import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7223/api/Login';
  isAuthenticated: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    this.initAuthStateChanged();
  }

  login(email: string, password: string): Observable<any> {
    this.isAuthenticated = true;
    return this.http.post<any>(`${this.apiUrl}`, {
      email: email,
      password: password,
    });
  }

  storeUserDetails(response: any): void {
    sessionStorage.setItem('currentUser', JSON.stringify(response));
  }

  getUserDetails(): any {
    const currentUser = sessionStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  }

  logout() {
    this.isAuthenticated = false;
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['']);
  }

  initAuthStateChanged() {
    if (typeof sessionStorage !== 'undefined') {
      const currentUser = sessionStorage.getItem('currentUser');
      this.isAuthenticated = !!currentUser;
    } else {
      this.isAuthenticated = false;
    }
  }
}
