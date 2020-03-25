import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl;

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   })
  // };

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  logIn(username: string, password: string): Observable<any> {
    return this.http.post(
      this.baseUrl + '/users/login',
      {
        username,
        password
      });
  }

  isLogged(): boolean {
    if (!localStorage.token) {
      return false;
    } else {
      const token = localStorage.getItem('token');
      return !this.jwtHelper.isTokenExpired(token);
    }
  }
}
