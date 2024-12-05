import { Component } from '@angular/core';
import {AuthService} from '../../../core/service/auth-service.component';
import {jwtDecode} from 'jwt-decode';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-dashboard-employer',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './dashboard-employer.component.html',
})
export class DashboardEmployerComponent {
  role = undefined
  email:string | undefined = ""
  firstLetter:string | undefined =""
  constructor(
    private authService: AuthService,
  ) {
    this.getName();
  }





  getName(){
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token);
    this.email = decodedToken?.sub
    this.firstLetter = this.email?.charAt(0).toUpperCase(); // Get the first letter and capitalize it
  }


}
