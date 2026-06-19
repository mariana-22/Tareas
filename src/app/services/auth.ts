import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseService } from './supabase';
import { User } from '../types';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private isBrowser: boolean;
  private authCheckDone = false;

  constructor(
    private supabase: SupabaseService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initializeAuth();
  }

  /**
   * Inicializar autenticación al cargar la app
   */
  private async initializeAuth() {
    if (!this.isBrowser) return;

    try {
      const { data: { session }, error } = await this.supabase.getSession();
      
      if (error) {
        console.error('Error verificando sesión:', error);
        this.authCheckDone = true;
        return;
      }

      if (session) {
        const user = session.user;
        this.currentUserSubject.next({
          id: user.id,
          email: user.email || '',
          created_at: user.created_at || new Date().toISOString()
        });
        this.isAuthenticatedSubject.next(true);
      }
    } catch (error) {
      console.error('Error inicializando autenticación:', error);
    } finally {
      this.authCheckDone = true;
    }
  }

  async register(email: string, password: string, passwordConfirm: string) {
    try {
      if (!email || !password || !passwordConfirm) {
        throw new Error('Todos los campos son requeridos');
      }
      if (!this.isValidEmail(email)) {
        throw new Error('El email que ingresaste no es válido');
      }
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }
      if (password !== passwordConfirm) {
        throw new Error('Las contraseñas no coinciden');
      }

      const { data, error: authError } = await this.supabase.signUp(email, password);
      
      if (authError) {
        // Mensajes de error más específicos
        if (authError.message.includes('already registered')) {
          throw new Error('Este email ya está registrado con una cuenta');
        } else if (authError.message.includes('Invalid email')) {
          throw new Error('El email ingresado no es válido');
        } else if (authError.message.includes('Password')) {
          throw new Error('La contraseña no cumple los requisitos de seguridad');
        } else {
          throw new Error(`Error en el registro: ${authError.message}`);
        }
      }

      if (!data.user) {
        throw new Error('No se pudo crear el usuario');
      }

      const usuario = {
        email: data.user.email,
        created_at: new Date().toISOString()
      };

      const { error: dbError } = await this.supabase.createUsuario(usuario);
      
      if (dbError) {
        console.warn('Advertencia al crear usuario en BD:', dbError);
      }

      console.log('✅ Usuario registrado exitosamente');
      return { 
        success: true, 
        user: {
          id: data.user.id,
          email: data.user.email || '',
          created_at: data.user.created_at || new Date().toISOString()
        }
      };
    } catch (error: any) {
      console.error('Error en registro:', error);
      return { success: false, error: error.message };
    }
  }

  async login(email: string, password: string) {
    try {
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }
      if (!this.isValidEmail(email)) {
        throw new Error('El email que ingresaste no es válido');
      }

      const { data, error } = await this.supabase.signIn(email, password);
      
      if (error) {
        // Mensajes de error más específicos
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email o contraseña incorrectos. Verifica tus datos e intenta de nuevo');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Tu email aún no ha sido confirmado. Revisa tu correo');
        } else if (error.message.includes('user not found')) {
          throw new Error('Este email no está registrado. ¿Deseas crear una cuenta?');
        } else {
          throw new Error(error.message);
        }
      }

      if (!data.user || !data.session) {
        throw new Error('Error en la respuesta de autenticación. Intenta de nuevo');
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        created_at: data.user.created_at || new Date().toISOString()
      };

      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);

      console.log('✅ Sesión iniciada correctamente');
      return { success: true, user };
    } catch (error: any) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      const { error } = await this.supabase.signOut();
      
      if (error) {
        console.error('Error en logout:', error);
      }

      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);

      console.log('✅ Sesión cerrada');
      return { success: true };
    } catch (error: any) {
      console.error('Error en logout:', error);
      return { success: false, error: error.message };
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser$(): Observable<User | null> {
    return this.currentUser$;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async waitForAuthCheck(): Promise<void> {
    let attempts = 0;
    while (!this.authCheckDone && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
  }
}
