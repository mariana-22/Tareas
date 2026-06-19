/**
 * Tipos y interfaces compartidas de la aplicación
 */

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthSession {
  user: User;
  session: {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    expires_at?: number;
    token_type: string;
  };
}

export interface Proyecto {
  id?: number;
  titulo: string;
  descripcion: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Tarea {
  id?: number;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en progreso' | 'completada';
  user_id: string;
  proyecto_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}

export interface SupabaseError {
  message: string;
  code?: string;
  status?: number;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
