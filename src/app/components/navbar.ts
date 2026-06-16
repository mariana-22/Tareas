import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <h1>🚀 Orbit</h1>
          <p>Gestión de Proyectos</p>
        </div>

        <div class="navbar-menu">
          <a routerLink="/dashboard" class="nav-link">
            <span>📊</span> Dashboard
          </a>
          <a routerLink="/proyectos" class="nav-link">
            <span>📁</span> Proyectos
          </a>
          <a routerLink="/tareas" class="nav-link">
            <span>📝</span> Tareas
          </a>
        </div>

        <div class="navbar-user">
          <span class="user-email" *ngIf="currentUser">{{ currentUser.email }}</span>
          <button class="btn-logout" (click)="logout()" *ngIf="currentUser">
            Cerrar Sesión
          </button>
          <a routerLink="/login" class="btn-login" *ngIf="!currentUser">
            Login
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: white;
      border-bottom: 2px solid #e2e8f0;
      padding: 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      flex-wrap: wrap;
      gap: 2rem;
    }

    .navbar-brand {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .navbar-brand h1 {
      margin: 0;
      font-size: 1.5rem;
      color: #1e293b;
    }

    .navbar-brand p {
      margin: 0;
      font-size: 0.75rem;
      color: #64748b;
    }

    .navbar-menu {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      text-decoration: none;
      color: #475569;
      font-weight: 500;
      transition: all 0.3s;
      border-radius: 6px;
    }

    .nav-link:hover {
      background: #f1f5f9;
      color: #2563eb;
    }

    .navbar-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-email {
      color: #64748b;
      font-size: 0.9rem;
    }

    .btn-logout {
      padding: 0.5rem 1rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s;
    }

    .btn-logout:hover {
      background: #dc2626;
    }

    .btn-login {
      padding: 0.5rem 1rem;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      text-decoration: none;
      display: inline-block;
      transition: background 0.3s;
    }

    .btn-login:hover {
      background: #1d4ed8;
    }

    @media (max-width: 768px) {
      .navbar-container {
        gap: 1rem;
        padding: 1rem;
      }

      .navbar-menu {
        width: 100%;
        order: 3;
        gap: 1rem;
      }

      .navbar-user {
        width: 100%;
        justify-content: flex-end;
        order: 4;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser: any = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
  }

  logout() {
    this.auth.logout();
    this.currentUser = null;
    this.router.navigate(['/login']);
  }
}
