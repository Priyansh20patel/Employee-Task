
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';  // JSON Server URL

  constructor(private http: HttpClient) {}

  // Method to add a new user
  register(userData: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }
}
