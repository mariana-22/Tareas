import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase';

@Component({
	selector: 'app-proyectos',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './proyectos.html',
	styleUrls: ['./proyectos.scss']
})
export class ProyectosComponent implements OnInit {
	proyectos: any[] = [];
	loading = false;
	showForm = false;

	newProyecto: any = { titulo: '', descripcion: '' };
	editing: any = null;

	constructor(private supabase: SupabaseService) {}

	async ngOnInit() {
		await this.cargarProyectos();
	}

	async cargarProyectos() {
		this.loading = true;
		const { data, error } = await this.supabase.getProyectos();
		this.loading = false;
		if (error) console.error('Error cargando proyectos:', error);
		else this.proyectos = data || [];
	}

	async crearProyecto() {
		if (!this.newProyecto.titulo.trim()) {
			alert('Por favor ingresa un título para el proyecto');
			return;
		}

		const proyecto = { ...this.newProyecto };
		const { error } = await this.supabase.createProyecto(proyecto);
		if (error) console.error('Error creando proyecto:', error);
		else {
			this.newProyecto = { titulo: '', descripcion: '' };
			this.showForm = false;
			await this.cargarProyectos();
		}
	}

	editarProyecto(proyecto: any) {
    this.editing = proyecto;
    this.newProyecto = { titulo: proyecto.titulo, descripcion: proyecto.descripcion };
    this.showForm = true;
  }

  cancelarEdicion() {
    this.editing = null;
    this.newProyecto = { titulo: '', descripcion: '' };
    this.showForm = false;
  }

  async guardarProyecto() {
    if (!this.newProyecto.titulo.trim()) {
      alert('Por favor ingresa un título para el proyecto');
      return;
    }

    if (this.editing) {
      const { error } = await this.supabase.updateProyecto(this.editing.id, this.newProyecto);
      if (error) console.error('Error actualizando proyecto:', error);
      else {
        this.cancelarEdicion();
        await this.cargarProyectos();
      }
      return;
    }

		await this.crearProyecto();
	}

	async eliminarProyecto(id: number) {
		if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
			const { error } = await this.supabase.deleteProyecto(id);
			if (error) console.error('Error eliminando proyecto:', error);
			else await this.cargarProyectos();
		}
	}
}
