import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const isLoggedIn = inject(AuthService).isLoggedIn();
  return isLoggedIn || inject(Router).createUrlTree(['/login']);
};
