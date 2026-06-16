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

    this.loading = true;

    try {
      let result;
      if (this.isRegistering) {
        result = await this.auth.register(this.email, this.password, this.passwordConfirm);
      } else {
        result = await this.auth.login(this.email, this.password);
      }

      if (result.success) {
        this.successMessage = this.isRegistering ? 'Cuenta creada exitosamente' : 'Login exitoso';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 500);
      } else {
        this.errorMessage = result.error || 'Error al procesar la solicitud';
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Error desconocido';
    } finally {
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
