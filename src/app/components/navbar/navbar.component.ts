import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {AuthService} from '../../core/service/auth-service.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, NgIf],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  dashboardRoute = "internships"

  constructor(protected authService: AuthService, private router: Router) {
  }

  onLinkChange(): void {
    const token = this.authService.getToken(); // Get the token
    if (token) {
      const decodedToken: any = this.authService.decodeToken(token);
      if (decodedToken && decodedToken.roles) {
        const roles = decodedToken.roles;
        if (roles.includes('ROLE_EMPLOYER')) {
          this.router.navigate(['/employer-dashboard']);
        } else  {
          this.router.navigate(['/internship-seeker-dashboard']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }


}
