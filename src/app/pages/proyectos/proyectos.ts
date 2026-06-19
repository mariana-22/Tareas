import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase';
import { AuthService } from '../../services/auth';
import { Proyecto, User } from '../../types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-proyectos',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './proyectos.html',
	styleUrls: ['./proyectos.scss']
})
export class ProyectosComponent implements OnInit, OnDestroy {
	proyectos: Proyecto[] = [];
	loading = false;
	showForm = false;
	currentUser: User | null = null;

	newProyecto: { titulo: string; descripcion: string } = { titulo: '', descripcion: '' };
	editing: Proyecto | null = null;

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
					this.cargarProyectos();
				}
			});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	async cargarProyectos() {
		if (!this.currentUser) return;

		this.loading = true;
		const { data, error } = await this.supabase.getProyectos(this.currentUser.id);
		this.loading = false;
		
		if (error) {
			console.error('Error cargando proyectos:', error);
		} else {
			this.proyectos = data || [];
		}
	}

	editarProyecto(proyecto: Proyecto) {
		this.editing = { ...proyecto };
		this.newProyecto = { 
			titulo: proyecto.titulo, 
			descripcion: proyecto.descripcion 
		};
		this.showForm = true;
	}

	cancelarEdicion() {
		this.editing = null;
		this.newProyecto = { titulo: '', descripcion: '' };
		this.showForm = false;
	}

	async guardarProyecto() {
		const user = this.auth.getCurrentUser();
		if (!user) {
			console.error('Usuario no autenticado');
			return;
		}

		if (this.editing && this.editing.id) {
			// Actualizar proyecto existente
			const { error } = await this.supabase.updateProyecto(this.editing.id, this.newProyecto);
			if (error) {
				console.error('Error actualizando proyecto:', error);
			} else {
				this.cancelarEdicion();
				await this.cargarProyectos();
			}
		} else {
			// Crear nuevo proyecto
			const proyecto: Proyecto = {
				titulo: this.newProyecto.titulo,
				descripcion: this.newProyecto.descripcion,
				user_id: user.id
			};

			const { error } = await this.supabase.createProyecto(proyecto);
			if (error) {
				console.error('Error creando proyecto:', error);
			} else {
				this.cancelarEdicion();
				await this.cargarProyectos();
			}
		}
	}

	async eliminarProyecto(id: number | undefined) {
		if (!id) return;

		if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
			const { error } = await this.supabase.deleteProyecto(id);
			if (error) {
				console.error('Error eliminando proyecto:', error);
			} else {
				await this.cargarProyectos();
			}
		}
	}
}
