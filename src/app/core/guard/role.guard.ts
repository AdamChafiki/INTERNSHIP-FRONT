import {CanActivateFn, Router} from '@angular/router';
import { inject } from '@angular/core';
import {AuthService} from '../service/auth-service.component';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Decode the token to extract roles
  const decodedToken: any = authService.decodeToken(token);
  const roles = decodedToken.roles;

  const requiredRole = route.data['role'] as string;
  if (roles.includes(requiredRole)) {
    return true;
  }

  // Redirect unauthorized users
  router.navigate(['/']);
  return false;
};
