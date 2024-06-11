import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actividad } from '../../model/actividad.model';
import { Subscription } from 'rxjs';
import { GestorActividadesService } from '../../service/gestor-actividades.service';
import { Columna } from '../../model/columna-kanban.model';
import { TableroProyectoService } from 'src/app/feature/proyectos/service/tablero-proyecto.service';
import { EstadoActividad, EstadoActividadMap } from '../../model/estado-actividad.model';
import { ResponsableActividad } from '../../model/responsable-actividad.model';
import { FormularioActividadComponent } from '../formulario-actividad/formulario-actividad.component';
import { MatDialog } from '@angular/material/dialog';
import { customConfig } from 'src/app/shared/app.constants';
import { UIService } from 'src/app/core/service/ui.service';
import { ConfirmDialogData } from 'src/app/core/model/confirm-dialog-data.model';
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { RoleService } from 'src/app/core/service/role.service';
import { TipoActividad } from 'src/app/feature/tipo-actividades/model/tipo-actividad.model';
import { TipoActividadesService } from 'src/app/feature/tipo-actividades/service/tipo-actividades.service';
import { TableroKanbanService } from '../../service/tablero-kanban.service';

@Component({
  selector: 'app-kanban-actividades',
  templateUrl: './kanban-actividades.component.html',
  styleUrls: ['./kanban-actividades.component.css']
})
export class KanbanActividadesComponent implements OnInit, OnDestroy {

  rango: FormGroup = new FormGroup({
    inicio: new FormControl<Date | null>(null),
    fin: new FormControl<Date | null>(null),
  });

  tipoActividadControl: FormControl = new FormControl(null);
  tipoActividades: TipoActividad[] = [];

  mostrarSoloMias = false;
  mostrarResetColumnas = false;
  columnas: Columna[];

  private subs: Subscription[] = [];

  mostrarNombreCompleto = (responsable: ResponsableActividad): string => {
    responsable.nombresCompletos = responsable.nombres + ' ' + responsable.apellidos;
    return responsable.nombresCompletos;
  };


  get hayActividades(): boolean {
    return this.kanbanService.hayActividades;
  }

  constructor(
    private actividadService: GestorActividadesService,
    private tableroservice: TableroProyectoService,
    private kanbanService: TableroKanbanService,
    private tipoActividadService: TipoActividadesService,
    private uiService: UIService,
    private dialog: MatDialog,
    public rolService: RoleService
  ) {
    this.columnas = kanbanService.columnas;
    if (this.columnas.find(col => col.oculta === true)) this.mostrarResetColumnas = true;
  }

  ngOnInit(): void {

    this.subs.push(
      this.tipoActividadService.obtenerTiposActividad().subscribe(tipos => this.tipoActividades = tipos)
    );

    this.subs.push(
      this.tipoActividadControl.valueChanges.subscribe(tipo => this.filtrarPorTipo(tipo))
    );
  }


  filtrarPorTipo(tipo: TipoActividad | null): void {
    this.kanbanService.filtrarPorTipo(tipo);
  }

  cancelarFiltroFecha() {
    if (!this.rango.pristine) {
      this.rango.setValue({ inicio: null, fin: null });
      this.kanbanService.filtrarPorFecha(null, null);
      this.rango.markAsPristine();
    }
  }

  aplicarFiltroFecha() {
    const { inicio, fin } = this.rango.value;
    this.kanbanService.filtrarPorFecha(inicio, fin);
  }

  filtrarMisActividades() {
    this.mostrarSoloMias = !this.mostrarSoloMias;
    this.kanbanService.filtrarMisActividades(this.mostrarSoloMias);
  }

  doFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.kanbanService.filtrarPorCampo(filterValue);
  }


  /**
   * metodos para controlar columnas del kanban
   */
  resetColumnas() {
    this.mostrarResetColumnas = false;
    this.kanbanService.resetColumnas();
  }

  toggleHide(column: Columna) {
    this.kanbanService.toggleHide(column);
    this.mostrarResetColumnas = true;
  }

  toggleExpand(column: Columna) {
    this.kanbanService.toggleExpand(column);
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
      this.dialog.open(ConfirmDialogComponent, { ...customConfig('0vw'), data }).afterClosed().subscribe(eliminado => {
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
