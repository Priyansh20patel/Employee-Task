import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users'; // JSON Server URL

  constructor(private http: HttpClient) {}

  // Register
  register(userData: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  // Login
  login(email: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.apiUrl}?email=${email}& password=${password}`
    );
  }

  // store user session
  storeUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  // Logout
  logout() {
    localStorage.removeItem('currentUser');
  }
}
