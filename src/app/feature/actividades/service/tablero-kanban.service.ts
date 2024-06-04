import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Actividad } from '../model/actividad.model';
import { ActividadFiltrada } from '../model/actividad-filtrada.model';
import { Columna } from '../model/columna-kanban.model';
import { TableroProyectoService } from '../../proyectos/service/tablero-proyecto.service';
import { TipoActividad } from '../../tipo-actividades/model/tipo-actividad.model';
import { EstadoActividad } from '../model/estado-actividad.model';
import { UsuarioSesion } from 'src/app/core/model/usuario-sesion.model';
import { AuthService } from 'src/app/core/service/auth.service';

@Injectable()
export class TableroKanbanService implements OnDestroy {

  private subs: Subscription[] = [];

  // actividades
  private actividades: Actividad[] = [];
  private actividadesFiltradas: BehaviorSubject<ActividadFiltrada> = new BehaviorSubject<ActividadFiltrada>({ prev: [], current: [] });

  get hayActividades(): boolean {
    return this.actividades.length > 0;
  }

  actividadesPorHacer: BehaviorSubject<Actividad[]> = new BehaviorSubject<Actividad[]>([]);
  actividadesEnProgreso: BehaviorSubject<Actividad[]> = new BehaviorSubject<Actividad[]>([]);
  actividadesEnRevision: BehaviorSubject<Actividad[]> = new BehaviorSubject<Actividad[]>([]);
  actividadesCompletadas: BehaviorSubject<Actividad[]> = new BehaviorSubject<Actividad[]>([]);

  // filtros
  private filtroMostrarMias = false;
  private filtroTipoActividad: TipoActividad | null = null;
  private filtroFecha: { inicio: Date | null, fin: Date | null } = { inicio: null, fin: null };
  private filtroCampo = "";

  private miUsuario: UsuarioSesion | null;

  columnas: Columna[] = [
    { id: 'POR_HACER', titulo: 'Por Hacer', actividades: this.actividadesPorHacer, oculta: false, prev: false, isExpanded: false, claseCss: 'por-hacer' },
    { id: 'EN_PROGRESO', titulo: 'En Progreso', actividades: this.actividadesEnProgreso, oculta: false, prev: false, isExpanded: false, claseCss: 'en-progreso' },
    { id: 'EN_REVISION', titulo: 'En Revisión', actividades: this.actividadesEnRevision, oculta: false, prev: false, isExpanded: false, claseCss: 'en-revision' },
    { id: 'COMPLETADA', titulo: 'Completada', actividades: this.actividadesCompletadas, oculta: false, prev: false, isExpanded: false, claseCss: 'completada' }
  ];



  constructor(
    private tableroservice: TableroProyectoService,
    private authService: AuthService
  ) {
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

    this.miUsuario = this.authService.obtenerUsuarioSesion();
  }

  /**
   * Filtros
   */

  filtrarPorTipo(tipo: TipoActividad | null): void {
    this.filtroTipoActividad = tipo;
    this.aplicarFiltros();
  }

  filtrarPorFecha(inicio: Date | null, fin: Date | null) {
    this.filtroFecha = { inicio, fin };
    this.aplicarFiltros();
  }

  filtrarMisActividades(mostrarSoloMias: boolean) {
    this.filtroMostrarMias = mostrarSoloMias;
    this.aplicarFiltros();
  }

  filtrarPorCampo(campo: string) {
    this.filtroCampo = campo;
    this.aplicarFiltros();
  }


  private aplicarFiltros() {
    let filtradas = this.actividades.slice();

    if (this.filtroTipoActividad) {
      filtradas = filtradas.filter(actividad => actividad.tipoActividad?.idTipo === this.filtroTipoActividad?.idTipo);
    }

    if (this.filtroMostrarMias) {
      filtradas = filtradas.filter(actividad => actividad.responsable.idUsuario === this.miUsuario?.idUsuario);
    }

    const { inicio, fin } = this.filtroFecha;
    if (inicio && fin) {
      filtradas = filtradas.filter(actividad => {
        const cierre = new Date(actividad.fechaCierreEsperado);
        return cierre >= new Date(inicio) && cierre <= new Date(fin);
      });
    }

    if (this.filtroCampo) {
      filtradas = filtradas.filter(actividad => {
        if (!this.filtroCampo) return true;
        const condicion1 = actividad.nombre.trim().toLowerCase().includes(this.filtroCampo);
        const condicion2 = actividad.responsable.nombresCompletos.trim().toLowerCase().includes(this.filtroCampo);
        return condicion1 || condicion2;
      });
    }

    this.actividadesFiltradas.next({
      prev: this.actividadesFiltradas.value.current,
      current: filtradas
    });

  }


  /**
   * metodos para controlar columnas del kanban
   */
  resetColumnas() {
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

  private updateColumnWidths() {
    const visibleColumns = this.columnas.filter(col => !col.oculta);

    visibleColumns.forEach(col => {
      if (visibleColumns.length === 1) this.toggleExpand(col);
    });
  }
  /**
   * Fin metodos para controlar columnas
   */



  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
