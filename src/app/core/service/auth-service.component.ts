import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {SignupResponse} from '../../models/signup-response';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BASE_URL = environment.apiUrl;
  constructor(private http: HttpClient, private router:Router) {}

  doLogin(request: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/auth/login`, request);
  }

  doRegister(SignupRequest: any): Observable<SignupResponse> {
    return this.http.post<any>(`${this.BASE_URL}/auth/signup`, SignupRequest);
  }

  doVerifyAccount(req: any): Observable<any> {
    // @ts-ignore
    return this.http.post<any>(`${this.BASE_URL}/auth/verify`, req, { responseType: 'text' });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(["/login"])
  }

  decodeToken(token: string | null ) {
    if(token){
      return jwtDecode(token);
    }else {
      return null
    }
  }

  // getUserId(): string | null {
  //   const token = this.getToken();
  //   if (token) {
  //     const decodedToken = this.decodeToken(token);
  //     console.log(decodedToken)
  //     return decodedToken.userId;
  //   }
  //   return null;
  // }
}
