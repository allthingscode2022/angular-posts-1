import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../models/Interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // server url for user routes
  public ROOT_URL = 'http://localhost:2000/user';
  constructor(private http: HttpClient) {}

  // post request method for adding a user
  public addUser(info): Observable<IUser> {
    return this.http.post<IUser>(`${this.ROOT_URL}/register`, info);
  }

  // post request method for user login
  public authenticateUser(info): Observable<IUser> {
    return this.http.post<IUser>(`${this.ROOT_URL}/login`, info);
  }
}
