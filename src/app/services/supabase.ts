import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

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

  getProyectos() {
    return this.supabase.from('proyectos').select('*');
  }

  getProyectoById(id: number) {
    return this.supabase.from('proyectos').select('*').eq('id', id).single();
  }

  createProyecto(proyecto: any) {
    return this.supabase.from('proyectos').insert(proyecto);
  }

  updateProyecto(id: number, proyecto: any) {
    return this.supabase.from('proyectos').update(proyecto).eq('id', id);
  }

  deleteProyecto(id: number) {
    return this.supabase.from('proyectos').delete().eq('id', id);
  }

  // ─── TAREAS ──────────────────────────────────────────

  getTareas() {
    return this.supabase.from('tareas').select('*');
  }

  getTareaById(id: number) {
    return this.supabase.from('tareas').select('*').eq('id', id).single();
  }

  createTarea(tarea: any) {
    return this.supabase.from('tareas').insert(tarea);
  }

  updateTarea(id: number, tarea: any) {
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

  // Método de prueba rápida para validar conexión y permisos
  ping() {
    return this.supabase.from('proyectos').select('id').limit(1);
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
}