import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;
  private isBrowser: boolean;

  constructor(
    private supabase: SupabaseService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadUser();
  }

  private loadUser() {
    try {
      if (this.isBrowser && typeof localStorage !== 'undefined') {
        const user = localStorage.getItem('current_user');
        if (user) this.currentUser = JSON.parse(user);
      }
    } catch (e) {
      console.error('Error cargando usuario:', e);
    }
  }

  async login(email: string, password: string) {
    try {
      // Validación básica
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }
      if (!this.isValidEmail(email)) {
        throw new Error('Email inválido');
      }
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Login local (sin Supabase Auth por ahora - por el rate limit)
      console.log('Login local para:', email);
      
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        created_at: new Date().toISOString()
      };
      this.currentUser = user;
      if (this.isBrowser && typeof localStorage !== 'undefined') {
        localStorage.setItem('current_user', JSON.stringify(user));
      }
      console.log('✅ Sesión iniciada');
      return { success: true, user };
    } catch (error: any) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    }
  }

  async register(email: string, password: string, passwordConfirm: string) {
    try {
      if (!email || !password || !passwordConfirm) {
        throw new Error('Todos los campos son requeridos');
      }
      if (!this.isValidEmail(email)) {
        throw new Error('Email inválido');
      }
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }
      if (password !== passwordConfirm) {
        throw new Error('Las contraseñas no coinciden');
      }

      console.log('Registro local para:', email);
      
      // Crear usuario localmente PRIMERO (sin id - será generado después)
      const nuevoUsuario: any = {
        email: email,
        created_at: new Date().toISOString()
      };
      
      // Guardar en tabla usuarios (Supabase generará el id automáticamente)
      console.log('Guardando usuario en la base de datos...');
      const resultUsuario = await this.supabase.createUsuario(nuevoUsuario);
      console.log('Resultado Supabase:', resultUsuario);
      
      if (resultUsuario.error) {
        console.error('❌ Error al guardar en Supabase:', resultUsuario.error);
        throw new Error(`No se pudo guardar el usuario: ${resultUsuario.error.message}`);
      } else {
        console.log('✅ Usuario guardado en Supabase');
        // Asignar el id generado por Supabase
        const data = (resultUsuario as any).data;
        if (data && Array.isArray(data) && data.length > 0) {
          nuevoUsuario.id = data[0].id;
        }
      }
      
      this.currentUser = nuevoUsuario;
      if (this.isBrowser && typeof localStorage !== 'undefined') {
        localStorage.setItem('current_user', JSON.stringify(this.currentUser));
      }
      console.log('✅ Usuario registrado exitosamente');
      return { success: true, user: nuevoUsuario };
    } catch (error: any) {
      console.error('Error en register:', error);
      return { success: false, error: error.message };
    }
  }

  logout() {
    this.currentUser = null;
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      localStorage.removeItem('current_user');
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
