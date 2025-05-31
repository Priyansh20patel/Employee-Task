

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserDto } from '../models/userDto';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/users'; // JSON Server URL

    constructor(private http: HttpClient) { }

    // Register
    register(userData: UserDto): Observable<UserDto> {
        userData.id = crypto.randomUUID();              // generate guid
        const status = { ...userData, status: 'Active' };
        return this.http.post<UserDto>(this.apiUrl, status);
    }


    // Login
    login(email: string, password: string): Observable<boolean> {
        return this.http.get<UserDto[]>(`${this.apiUrl}?email=${email}`).pipe(      // check email then proceed to password
            map((users) => {
                const user = users.find((u) => u.password === password);
                if (user) {
                    localStorage.setItem('isLoggedIn', 'true');
                    return true;
                }
                return false;
            })
        );
    }

    // flag login state
    isLoggedIn(): boolean {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    //Get user
    getUsers(): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(this.apiUrl);
    }

    // Delete User
    deleteUser(userid: string): Observable<UserDto[]> {
        return this.http.delete<UserDto[]>(`${this.apiUrl}/${userid}`);
    }

    // Get User by id
    getUserById(userid: string): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(`${this.apiUrl}/${userid}`);
    }

    // Edit User
    updateUser(user: UserDto) {
        return this.http.put<UserDto>(
            `http://localhost:3000/users/${user.id}`, user);
    }

    // Email validation
    checkEmail(email: string): Observable<boolean> {
        return this.http
            .get<UserDto[]>(`${this.apiUrl}?email=${email}`)     //fetch user with email
            .pipe(map((users) => users.length > 0));
    }
}
