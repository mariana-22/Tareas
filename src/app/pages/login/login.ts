import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  email = '';
  password = '';
  passwordConfirm = '';
  loading = false;
  isRegistering = false;
  errorMessage = '';
  successMessage = '';

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  async loginOrRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    if (this.isRegistering && !this.passwordConfirm) {
      this.errorMessage = 'Por favor confirma tu contraseña';
      return;
    }

    this.loading = true;

    try {
      let result;
      if (this.isRegistering) {
        // Validaciones adicionales para registro
        if (this.password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        if (this.password !== this.passwordConfirm) {
          throw new Error('Las contraseñas no coinciden');
        }
        result = await this.auth.register(this.email, this.password, this.passwordConfirm);
      } else {
        result = await this.auth.login(this.email, this.password);
      }

      if (result.success) {
        if (this.isRegistering) {
          // Después del registro, hacer login automático
          this.successMessage = '✓ Cuenta creada. Iniciando sesión...';
          const loginResult = await this.auth.login(this.email, this.password);
          
          if (loginResult.success) {
            this.successMessage = '✓ ¡Bienvenido!';
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 500);
          } else {
            this.errorMessage = '✓ Cuenta creada. Por favor inicia sesión manualmente';
            this.loading = false;
            setTimeout(() => {
              this.email = '';
              this.password = '';
              this.passwordConfirm = '';
              this.isRegistering = false;
              this.successMessage = '';
              this.errorMessage = '';
            }, 2000);
          }
        } else {
          this.successMessage = '✓ ¡Bienvenido!';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 500);
        }
      } else {
        // Manejo específico de diferentes errores
        const errorMsg = result.error || 'Error al procesar la solicitud';
        
        if (errorMsg.includes('Invalid login credentials')) {
          this.errorMessage = '✗ Email o contraseña incorrectos';
        } else if (errorMsg.includes('User already registered')) {
          this.errorMessage = '✗ Este email ya está registrado. Intenta con otro o usa login';
        } else if (errorMsg.includes('Email not confirmed')) {
          this.errorMessage = '✗ Por favor confirma tu email antes de iniciar sesión';
        } else if (errorMsg.includes('user not found')) {
          this.errorMessage = '✗ Este email no está registrado. ¿Deseas crear una cuenta?';
        } else {
          this.errorMessage = `✗ ${errorMsg}`;
        }
        this.loading = false;
      }
    } catch (error: any) {
      this.errorMessage = `✗ ${error.message || 'Error desconocido'}`;
      this.loading = false;
    }
  }

  toggleMode() {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
    this.successMessage = '';
    this.email = '';
    this.password = '';
    this.passwordConfirm = '';
  }

  isFormValid(): boolean {
    if (!this.email || !this.password) return false;
    if (this.isRegistering) {
      return this.password === this.passwordConfirm && this.password.length >= 6;
    }
    return this.password.length >= 6;
  }
}
