import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Proyecto, Tarea } from '../types';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // ─── PROYECTOS ───────────────────────────────────────

  /**
   * Obtener proyectos del usuario actual
   */
  getProyectos(userId: string) {
    return this.supabase
      .from('proyectos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  }

  getProyectoById(id: number) {
    return this.supabase.from('proyectos').select('*').eq('id', id).single();
  }

  createProyecto(proyecto: Proyecto) {
    return this.supabase.from('proyectos').insert(proyecto);
  }

  updateProyecto(id: number, proyecto: Partial<Proyecto>) {
    return this.supabase.from('proyectos').update(proyecto).eq('id', id);
  }

  deleteProyecto(id: number) {
    return this.supabase.from('proyectos').delete().eq('id', id);
  }

  // ─── TAREAS ──────────────────────────────────────────

  /**
   * Obtener tareas del usuario actual
   */
  getTareas(userId: string) {
    return this.supabase
      .from('tareas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  }

  getTareaById(id: number) {
    return this.supabase.from('tareas').select('*').eq('id', id).single();
  }

  createTarea(tarea: Tarea) {
    return this.supabase.from('tareas').insert(tarea);
  }

  updateTarea(id: number, tarea: Partial<Tarea>) {
    return this.supabase.from('tareas').update(tarea).eq('id', id);
  }

  deleteTarea(id: number) {
    return this.supabase.from('tareas').delete().eq('id', id);
  }

  // ─── USUARIOS ────────────────────────────────────────

  getUsuarios() {
    return this.supabase.from('usuarios').select('*');
  }

  createUsuario(usuario: any) {
    return this.supabase.from('usuarios').insert(usuario);
  }

  updateUsuario(id: number, usuario: any) {
    return this.supabase.from('usuarios').update(usuario).eq('id', id);
  }

  deleteUsuario(id: number) {
    return this.supabase.from('usuarios').delete().eq('id', id);
  }

  // ─── AUTENTICACIÓN ──────────────────────────────────

  async signUp(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password });
  }

  async signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return this.supabase.auth.signOut();
  }

  async getUser() {
    return this.supabase.auth.getUser();
  }

  async getSession() {
    return this.supabase.auth.getSession();
  }

  // ─── UTILIDADES ──────────────────────────────────────

  /**
   * Validar conexión a Supabase
   */
  ping() {
    return this.supabase.from('proyectos').select('id').limit(1);
  }

  /**
   * Obtener cliente de Supabase (solo si es necesario acceso directo)
   */
  getClient() {
    return this.supabase;
  }
}