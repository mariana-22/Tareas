import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas.html',
  styleUrls: ['./tareas.scss']
})
export class TareasComponent implements OnInit {
  tareas: any[] = [];
  loading = false;
  showForm = false;
  newTarea: any = { titulo: '', descripcion: '', estado: 'pendiente' };
  editing: any = null;
  filtroEstado = 'pendiente';

  estadosFiltro = [
    { label: '🔵 Pendiente', value: 'pendiente' },
    { label: '🟡 En Progreso', value: 'en progreso' },
    { label: '✅ Completada', value: 'completada' }
  ];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    await this.cargarTareas();
  }

  async cargarTareas() {
    this.loading = true;
    const { data, error } = await this.supabase.getTareas();
    this.loading = false;
    if (error) console.error('Error cargando tareas:', error);
    else this.tareas = data || [];
  }

  get tareasFiltradas() {
    return this.tareas.filter(t => (t.estado || 'pendiente') === this.filtroEstado);
  }

  contarPorEstado(estado: string): number {
    return this.tareas.filter(t => (t.estado || 'pendiente') === estado).length;
  }

  async eliminarTarea(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      const { error } = await this.supabase.deleteTarea(id);
      if (error) console.error('Error eliminando tarea:', error);
      else await this.cargarTareas();
    }
  }

  editarTarea(tarea: any) {
    this.editing = { ...tarea };
    this.newTarea = { ...tarea };
    this.showForm = true;
  }

  cancelarEdicion() {
    this.editing = null;
    this.newTarea = { titulo: '', descripcion: '', estado: 'pendiente' };
    this.showForm = false;
  }

  async guardarTarea() {
    if (!this.newTarea.titulo.trim()) {
      alert('Por favor ingresa un título para la tarea');
      return;
    }

    if (this.editing) {
      const { error } = await this.supabase.updateTarea(this.editing.id, this.newTarea);
      if (error) console.error('Error actualizando tarea:', error);
      else {
        this.cancelarEdicion();
        await this.cargarTareas();
      }
      return;
    }

    const { error } = await this.supabase.createTarea(this.newTarea);
    if (error) console.error('Error creando tarea:', error);
    else {
      this.newTarea = { titulo: '', descripcion: '', estado: 'pendiente' };
      this.showForm = false;
      await this.cargarTareas();
    }
  }
}