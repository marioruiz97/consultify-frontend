import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actividad } from '../../model/actividad.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GestorActividadesService } from '../../service/gestor-actividades.service';
import { Columna } from '../../model/columna-kanban.model';
import { TableroProyectoService } from 'src/app/feature/proyectos/service/tablero-proyecto.service';
import { EstadoActividad, EstadoActividadMap } from '../../model/estado-actividad.model';
import { ResponsableActividad } from '../../model/responsable-actividad.model';
import { AuthService } from 'src/app/core/service/auth.service';
import { UsuarioSesion } from 'src/app/core/model/usuario-sesion.model';
import { FormularioActividadComponent } from '../formulario-actividad/formulario-actividad.component';
import { MatDialog } from '@angular/material/dialog';
import { DIALOG_CONFIG, customConfig } from 'src/app/shared/app.constants';
import { UIService } from 'src/app/core/service/ui.service';
import { ConfirmDialogData } from 'src/app/core/model/confirm-dialog-data.model';
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';
import { ActividadFiltrada } from '../../model/actividad-filtrada.model';
import { FormControl, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-kanban-actividades',
  templateUrl: './kanban-actividades.component.html',
  styleUrls: ['./kanban-actividades.component.css']
})
export class KanbanActividadesComponent implements OnInit, OnDestroy {

  private miUsuario: UsuarioSesion | null;
  private actividades: Actividad[] = [];
  private actividadesFiltradas: BehaviorSubject<ActividadFiltrada> = new BehaviorSubject<ActividadFiltrada>({ prev: [], current: [] });

  actividadesPorHacer: BehaviorSubject<Actividad[]> = new BehaviorSubject<Actividad[]>([]);
  actividadesEnProgreso: BehaviorSubject<Actividad[]> = new BehaviorSubject<Actividad[]>([]);
  actividadesEnRevision: BehaviorSubject<Actividad[]> = new BehaviorSubject<Actividad[]>([]);
  actividadesCompletadas: BehaviorSubject<Actividad[]> = new BehaviorSubject<Actividad[]>([]);

  rango: FormGroup = new FormGroup({
    inicio: new FormControl<Date | null>(null),
    fin: new FormControl<Date | null>(null),
  });

  mostrarSoloMias = false;
  mostrarResetColumnas = false;
  columnas: Columna[] = [
    { id: 'POR_HACER', titulo: 'Por Hacer', actividades: this.actividadesPorHacer, oculta: false, prev: false, isExpanded: false, claseCss: 'por-hacer' },
    { id: 'EN_PROGRESO', titulo: 'En Progreso', actividades: this.actividadesEnProgreso, oculta: false, prev: false, isExpanded: false, claseCss: 'en-progreso' },
    { id: 'EN_REVISION', titulo: 'En Revisión', actividades: this.actividadesEnRevision, oculta: false, prev: false, isExpanded: false, claseCss: 'en-revision' },
    { id: 'COMPLETADA', titulo: 'Completada', actividades: this.actividadesCompletadas, oculta: false, prev: false, isExpanded: false, claseCss: 'completada' }
  ];

  private subs: Subscription[] = [];

  mostrarNombreCompleto = (responsable: ResponsableActividad): string => {
    responsable.nombresCompletos = responsable.nombres + ' ' + responsable.apellidos;
    return responsable.nombresCompletos;
  };


  get hayActividades() {
    return this.actividades.length > 0;
  }

  constructor(
    private actividadService: GestorActividadesService,
    private tableroservice: TableroProyectoService,
    private authService: AuthService,
    private uiService: UIService,
    private dialog: MatDialog
  ) {
    this.miUsuario = this.authService.obtenerUsuarioSesion();
  }

  ngOnInit(): void {
    this.subs.push(
      this.actividadesFiltradas.subscribe(filtradas => {
        this.actividadesPorHacer.next(filtradas.current.filter(actividad => actividad.estado == EstadoActividad.POR_HACER));
        this.actividadesEnProgreso.next(filtradas.current.filter(actividad => actividad.estado == EstadoActividad.EN_PROGRESO));
        this.actividadesEnRevision.next(filtradas.current.filter(actividad => actividad.estado == EstadoActividad.EN_REVISION));
        this.actividadesCompletadas.next(filtradas.current.filter(actividad => actividad.estado == EstadoActividad.COMPLETADA));
      })
    );

    this.subs.push(
      this.tableroservice.tableroActual.subscribe(tablero => {
        if (tablero) {
          this.actividades = tablero.actividades;
          this.actividadesFiltradas.next({ prev: this.actividades, current: this.actividades });
        }
      })
    );
  }

  cancelarFiltroFecha() {
    if (!this.rango.pristine) {
      this.rango.setValue({ inicio: null, fin: null });
      this.aplicarFiltros(this.actividadesFiltradas.value.prev);
      this.rango.markAsPristine()
    }
  }

  aplicarFiltroFecha() {
    const { inicio, fin } = this.rango.value;
    if (inicio && fin) {
      const filtradas: Actividad[] = this.actividades.filter(actividad => {
        const cierre = new Date(actividad.fechaCierreEsperado);
        return cierre >= new Date(inicio) && cierre <= new Date(fin);
      });
      this.aplicarFiltros(filtradas);
    }
  }

  filtrarMisActividades() {
    this.mostrarSoloMias = !this.mostrarSoloMias;
    const actividades = this.mostrarSoloMias ? this.actividadesFiltradas.value.current : this.actividadesFiltradas.value.prev;
    this.aplicarFiltros(actividades);
  }

  doFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const filtradas: Actividad[] = this.actividades.filter(actividad => {
      if (!filterValue) return true;
      const condicion1 = actividad.nombre.trim().toLowerCase().includes(filterValue);
      const condicion2 = actividad.responsable.nombresCompletos.trim().toLowerCase().includes(filterValue);
      return condicion1 || condicion2;
    });
    this.aplicarFiltros(filtradas);
  }

  private aplicarFiltros(filtradas: Actividad[]) {
    const prev = this.actividadesFiltradas.value.current;
    if (this.mostrarSoloMias) {
      const current: Actividad[] = filtradas.filter(actividad => actividad.responsable.idUsuario === this.miUsuario?.idUsuario);
      this.actividadesFiltradas.next({ prev, current });
    } else {
      this.actividadesFiltradas.next({ prev, current: filtradas });
    }
  }

  /**
   * metodos para controlar columnas del kanban
   */
  resetColumnas() {
    this.mostrarResetColumnas = false;
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
    this.mostrarResetColumnas = true;
  }

  toggleExpand(column: Columna) {
    const expandir = !column.isExpanded;

    if (expandir) {
      this.columnas.forEach(col => {
        col.prev = col.oculta;
        if (col === column) col.isExpanded = true;
        else {
          col.isExpanded = false;
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

    visibleColumns.forEach(col => {
      if (visibleColumns.length === 1) this.toggleExpand(col);
    });
  }
  /**
   * Fin metodos para controlar columnas
   */

  abrirCrearActividad() {
    this.dialog.open(FormularioActividadComponent, { ...customConfig('50vw', '60vh'), position: { right: '2px' } });
  }

  abrirEditarActividad(data: Actividad) {
    this.dialog.open(FormularioActividadComponent, { data, ...customConfig('50vw', '60vh'), position: { right: '2px' } });
  }

  eliminarActividad(actividad: Actividad) {
    const data: ConfirmDialogData = {
      title: "Eliminar Actividad",
      message: `¿Estás seguro de eliminar la actividad ${actividad.id}: ${actividad.nombre}?`,
      errors: [],
      confirm: "Sí, deseo eliminarla",
      showCancel: true
    }
    this.subs.push(
      this.dialog.open(ConfirmDialogComponent, { ...DIALOG_CONFIG, data }).afterClosed().subscribe(eliminado => {
        if (eliminado) this.actividadService.eliminarActividad(actividad.id)
          .then(() => {
            this.uiService.mostrarAlerta(`La actividad ${actividad.nombre} ha sido eliminada con éxito`);
            this.tableroservice.eliminarActividad(actividad);
          })
          .catch(err => this.uiService.mostrarError(err));
      }));
  }

  /**
   * metodos para drag and drop
   */
  get mapColumnas(): string[] {
    return this.columnas.map(c => c.id)
  }

  drop(event: CdkDragDrop<Actividad[] | null>) {

    if (event.previousContainer === event.container) {

      if (event.container.data) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      }

    } else if (event.previousContainer.data && event.container.data) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Obtener la actividad y el nuevo estado
      const actividad = event.container.data[event.currentIndex];
      const nuevoEstado = this.getEstadoPorId(event.container.id);

      if (actividad.estado !== nuevoEstado) {
        // Actualizar el estado de la actividad
        actividad.estado = nuevoEstado;

        // Enviar petición HTTP para actualizar el estado en la API
        this.actividadService.actualizarEstado(actividad)
          .then(guardada => {
            this.uiService.mostrarSnackBar(`La actividad ${guardada.nombre} se ha movido a ${EstadoActividadMap.get(guardada.estado)}`, 1.5);
            this.tableroservice.actualizarEstadoActividad(guardada);
          })
          .catch(err => this.uiService.mostrarError(err));
      }
    }
  }

  private getEstadoPorId(id: string): EstadoActividad {
    switch (id) {
      case 'POR_HACER': return EstadoActividad.POR_HACER;
      case 'EN_PROGRESO': return EstadoActividad.EN_PROGRESO;
      case 'EN_REVISION': return EstadoActividad.EN_REVISION;
      case 'COMPLETADA': return EstadoActividad.COMPLETADA;
      default: return EstadoActividad.POR_HACER;
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
