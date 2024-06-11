import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Actividad } from '../../model/actividad.model';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableroProyectoService } from 'src/app/feature/proyectos/service/tablero-proyecto.service';
import { UIService } from 'src/app/core/service/ui.service';
import { FormularioActividadComponent } from '../formulario-actividad/formulario-actividad.component';
import { customConfig } from 'src/app/shared/app.constants';
import { MatDialog } from '@angular/material/dialog';
import { EstadoActividad, EstadoActividadMap } from '../../model/estado-actividad.model';
import { DatePipe } from '@angular/common';
import { RoleService } from 'src/app/core/service/role.service';


@Component({
  selector: 'app-proximas-actividades',
  templateUrl: './proximas-actividades.component.html',
  styleUrls: ['./proximas-actividades.component.css']
})
export class ProximasActividadesComponent implements OnInit, AfterViewInit, OnDestroy {

  private subs: Subscription[] = [];
  private mostrarAlertaVencidas = true;

  displayedColumns = ['nombre', 'fechaCierreEsperado', 'tipoActividad', 'estado', 'responsable', 'accion'];
  datasource = new MatTableDataSource<Actividad>();

  mostrarTabla = true;
  fechaFutura = new Date();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  get fechaFormateada() {
    return this.datePipe.transform(this.fechaFutura, 'EEEE dd MMMM y', 'es-ES');
  }

  constructor(
    private tableroService: TableroProyectoService,
    private uiService: UIService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    public rolService: RoleService
  ) {
    this.fechaFutura.setHours(0, 0, 0, 0);
    this.fechaFutura.setDate(new Date().getDate() + 7);
  }

  ngOnInit(): void {
    this.setSortingAccesor();

    this.subs.push(
      this.tableroService.tableroActual.subscribe(tablero => {
        if (tablero) {

          const actividades: Actividad[] = tablero.actividades;
          this.datasource.data = actividades.filter(actividad => new Date(actividad.fechaCierreEsperado).getTime() <= new Date(this.fechaFutura).getTime() && actividad.estado !== EstadoActividad.COMPLETADA);
          this.mostrarTabla = this.datasource.data.length !== 0;


          const vencidas: Actividad[] = this.datasource.data.filter(actividad => new Date(actividad.fechaCierreEsperado).getTime() < new Date().getTime())
          if (vencidas && vencidas.length > 0 && this.mostrarAlertaVencidas) {
            this.mostrarAlertaVencidas = false;
            const message = `Hay ${vencidas.length} ${vencidas.length != 1 ? 'actividades' : 'actividad'} cuya fecha de cierre ya ha pasado`;
            const errors: string[] = vencidas.map((actividad, i) => `${i + 1} - ${actividad.nombre}, responsable: ${actividad.responsable.nombres} ${actividad.responsable.apellidos}`);
            this.uiService.mostrarConfirmDialog({
              title: 'Alerta: Actividades Vencidas',
              message,
              errors,
              showCancel: false,
              confirm: 'Aceptar'
            });
          }
        }

      })
    );

  }

  ngAfterViewInit(): void {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  private setSortingAccesor() {
    this.datasource.sortingDataAccessor = (item, property) => {
      if (property == 'responsable') return `${item.responsable.nombres} ${item.responsable.apellidos}`;
      if (property == 'estado') return this.getVencida(item);
      if (property == 'tipoActividad') return `${item.tipoActividad.nombre}`;
      return item[property];
    }
  }

  getVencida(actividad: Actividad): string {
    const date = new Date();
    const vence = date.getTime() > new Date(actividad.fechaCierreEsperado).getTime() ? 'Vencida' : 'Por vencer';
    return `${vence} (${EstadoActividadMap.get(actividad.estado)})`;
  }

  doFilter(event: Event) {
    const filterString: string = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.datasource.filter = filterString.trim().toLocaleLowerCase();
  }

  abrirEditarActividad(data: Actividad) {
    this.dialog.open(FormularioActividadComponent, { data, ...customConfig('50vw', '60vh'), position: { right: '2px' } });
  }

  ngOnDestroy(): void {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
    this.mostrarAlertaVencidas = true;
  }

}
