import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  totalProyectos = 0;
  totalTareas = 0;
  tareasPendientes = 0;
  tareasCompletadas = 0;
  completionRate = 0;
  loading = false;

  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    console.log('Dashboard ngOnInit iniciado');
    this.cargarEstadisticas();
  }

  async cargarEstadisticas() {
    try {
      console.log('Iniciando cargarEstadisticas');
      this.loading = true;
      this.cdr.markForCheck();
      
      // Intentar cargar proyectos
      console.log('Cargando proyectos...');
      const projResult = await this.supabase.getProyectos();
      console.log('Proyectos cargados:', projResult);
      
      if (projResult.error) {
        console.error('Error cargando proyectos:', projResult.error);
        this.totalProyectos = 0;
      } else {
        this.totalProyectos = projResult.data?.length ?? 0;
        console.log('Total proyectos:', this.totalProyectos);
      }

      // Intentar cargar tareas
      console.log('Cargando tareas...');
      const tareasResult = await this.supabase.getTareas();
      console.log('Tareas cargadas:', tareasResult);
      
      if (tareasResult.error) {
        console.error('Error cargando tareas:', tareasResult.error);
        this.totalTareas = 0;
        this.tareasPendientes = 0;
        this.tareasCompletadas = 0;
      } else {
        const tareas = tareasResult.data || [];
        this.totalTareas = tareas.length;

        // Contar tareas por estado
        this.tareasPendientes = tareas.filter((t: any) => 
          (t.estado || 'pendiente').toLowerCase() === 'pendiente'
        ).length;

        this.tareasCompletadas = tareas.filter((t: any) => 
          (t.estado || '').toLowerCase() === 'completada'
        ).length;

        // Calcular porcentaje de completadas
        if (this.totalTareas > 0) {
          this.completionRate = Math.round((this.tareasCompletadas / this.totalTareas) * 100);
        } else {
          this.completionRate = 0;
        }

        console.log('Stats calculadas:', {
          totalTareas: this.totalTareas,
          pendientes: this.tareasPendientes,
          completadas: this.tareasCompletadas,
          rate: this.completionRate
        });
      }
      
      this.loading = false;
      this.cdr.markForCheck();
      console.log('cargarEstadisticas finalizado, loading:', this.loading);
    } catch (error) {
      console.error('Error en cargarEstadisticas:', error);
      this.totalProyectos = 0;
      this.totalTareas = 0;
      this.tareasPendientes = 0;
      this.tareasCompletadas = 0;
      this.completionRate = 0;
      this.loading = false;
      this.cdr.markForCheck();
    }
  }
}

