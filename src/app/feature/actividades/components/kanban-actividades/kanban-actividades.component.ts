import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actividad } from '../../model/actividad.model';
import { Subscription } from 'rxjs';
import { GestorActividadesService } from '../../service/gestor-actividades.service';
import { Columna } from '../../model/columna-kanban.model';

@Component({
  selector: 'app-kanban-actividades',
  templateUrl: './kanban-actividades.component.html',
  styleUrls: ['./kanban-actividades.component.css']
})
export class KanbanActividadesComponent implements OnInit, OnDestroy {

  actividadesPorHacer: Actividad[] = [];
  actividadesEnCurso: Actividad[] = [];
  actividadesEnRevision: Actividad[] = [];
  actividadesCompletadas: Actividad[] = [];

  mostrarReset = false;
  columnas: Columna[] = [
    { titulo: 'Por Hacer', actividades: this.actividadesPorHacer, oculta: false, prev: false, isExpanded: false, ancho: '25' },
    { titulo: 'En Curso', actividades: this.actividadesEnCurso, oculta: false, prev: false, isExpanded: false, ancho: '25' },
    { titulo: 'En Revisión', actividades: this.actividadesEnRevision, oculta: false, prev: false, isExpanded: false, ancho: '25' },
    { titulo: 'Completada', actividades: this.actividadesCompletadas, oculta: false, prev: false, isExpanded: false, ancho: '25' }
  ];

  private subs: Subscription[] = [];


  constructor(
    private actividadService: GestorActividadesService
  ) { }

  ngOnInit(): void {
    console.log('on init kanban');
  }

  /**
   * metodos para controlar columnas del kanban
   */
  resetColumnas() {
    this.mostrarReset = false;
    this.columnas.forEach(col => {
      col.isExpanded = false;
      col.oculta = false;
      col.prev = false;
    });
    this.updateColumnWidths();
  }

  toggleHide(column: Columna) {
    column.prev = column.oculta;
    column.oculta = !column.oculta;
    this.updateColumnWidths();
    this.mostrarReset = true;
  }

  toggleExpand(column: Columna) {
    const expandir = !column.isExpanded;

    if (expandir) {
      this.columnas.forEach(col => {
        col.prev = col.oculta;
        if (col === column) {
          col.isExpanded = true;
          col.ancho = '100%';
        }
        else {
          col.isExpanded = false;
          col.ancho = '0%'
          col.oculta = true;
        }
      });

    } else {
      this.columnas.forEach(col => {
        col.oculta = col.prev;
        col.isExpanded = false;
      });
      this.updateColumnWidths();
    }
  }

  updateColumnWidths() {
    const visibleColumns = this.columnas.filter(col => !col.oculta);
    const columnWidth = `${100 / visibleColumns.length}%`;

    visibleColumns.forEach(col => {
      col.ancho = columnWidth;
      if (visibleColumns.length === 1) this.toggleExpand(col);
    });
  }
  /**
   * Fin metodos para controlar columnas
   */

  abrirCrearActividad() {
    throw new Error('Method not implemented.');
  }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
