import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/service/auth-service.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './main-layout.component.html',
})
export class DashboardInternshipSeekerComponent {
  email: string | undefined = '';
  firstLetter: string | undefined = '';

  constructor(private authService: AuthService) {
    this.getName();
  }

  getName() {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token);
    this.email = decodedToken?.sub;
    this.firstLetter = this.email?.charAt(0).toUpperCase(); 
  }
}
