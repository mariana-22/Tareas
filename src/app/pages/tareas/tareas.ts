import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase';
import { AuthService } from '../../services/auth';
import { Tarea, User } from '../../types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas.html',
  styleUrls: ['./tareas.scss']
})
export class TareasComponent implements OnInit, OnDestroy {
  tareas: Tarea[] = [];
  loading = false;
  showForm = false;
  currentUser: User | null = null;

  newTarea: { titulo: string; descripcion: string; estado: string } = { 
    titulo: '', 
    descripcion: '', 
    estado: 'pendiente' 
  };
  editing: Tarea | null = null;
  filtroEstado = 'pendiente';

  estadosFiltro = [
    { label: '🔵 Pendiente', value: 'pendiente' },
    { label: '🟡 En Progreso', value: 'en progreso' },
    { label: '✅ Completada', value: 'completada' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private supabase: SupabaseService,
    private auth: AuthService
  ) {}

  async ngOnInit() {
    // Esperar a que se complete la verificación de autenticación
    await this.auth.waitForAuthCheck();

    // Suscribirse al usuario actual
    this.auth.getCurrentUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.cargarTareas();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async cargarTareas() {
    if (!this.currentUser) return;

    this.loading = true;
    const { data, error } = await this.supabase.getTareas(this.currentUser.id);
    this.loading = false;

    if (error) {
      console.error('Error cargando tareas:', error);
    } else {
      this.tareas = data || [];
    }
  }

  get tareasFiltradas() {
    return this.tareas.filter(t => (t.estado || 'pendiente') === this.filtroEstado);
  }

  contarPorEstado(estado: string): number {
    return this.tareas.filter(t => (t.estado || 'pendiente') === estado).length;
  }

  async eliminarTarea(id: number | undefined) {
    if (!id) return;

    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      const { error } = await this.supabase.deleteTarea(id);
      if (error) {
        console.error('Error eliminando tarea:', error);
      } else {
        await this.cargarTareas();
      }
    }
  }

  editarTarea(tarea: Tarea) {
    this.editing = { ...tarea };
    this.newTarea = {
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      estado: tarea.estado
    };
    this.showForm = true;
  }

  cancelarEdicion() {
    this.editing = null;
    this.newTarea = { titulo: '', descripcion: '', estado: 'pendiente' };
    this.showForm = false;
  }

  async guardarTarea() {
    const user = this.auth.getCurrentUser();
    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }

    if (this.editing && this.editing.id) {
      // Actualizar tarea existente
      const { error } = await this.supabase.updateTarea(this.editing.id, {
        titulo: this.newTarea.titulo,
        descripcion: this.newTarea.descripcion,
        estado: this.newTarea.estado as 'pendiente' | 'en progreso' | 'completada'
      });
      if (error) {
        console.error('Error actualizando tarea:', error);
      } else {
        this.cancelarEdicion();
        await this.cargarTareas();
      }
    } else {
      // Crear nueva tarea
      const nuevaTarea: Tarea = {
        titulo: this.newTarea.titulo,
        descripcion: this.newTarea.descripcion,
        estado: this.newTarea.estado as 'pendiente' | 'en progreso' | 'completada',
        user_id: user.id
      };

      const { error } = await this.supabase.createTarea(nuevaTarea);
      if (error) {
        console.error('Error creando tarea:', error);
      } else {
        this.cancelarEdicion();
        await this.cargarTareas();
      }
    }
  }
}