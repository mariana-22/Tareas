import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    // Esperar a que se complete la verificación de autenticación
    await this.authService.waitForAuthCheck();

    const isAuthenticated = this.authService.isAuthenticated();
    
    if (isAuthenticated) {
      return true;
    }

    // Redirige a login si no está autenticado
    this.router.navigate(['/login']);
    return false;
  }
}
