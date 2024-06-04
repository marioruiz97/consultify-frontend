import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from 'src/app/core/model/confirm-dialog-data.model';
import { RoleService } from 'src/app/core/service/role.service';
import { UIService } from 'src/app/core/service/ui.service';
import { DIALOG_CONFIG } from 'src/app/shared/app.constants';
import { TipoActividad } from '../../model/tipo-actividad.model';
import { TipoActividadesService } from '../../service/tipo-actividades.service';
import { FormularioTipoActividadesComponent } from '../formulario-tipo-actividades/formulario-tipo-actividades.component';

@Component({
  selector: 'app-lista-tipo-actividades',
  templateUrl: './lista-tipo-actividades.component.html',
  styleUrls: ['./lista-tipo-actividades.component.css']
})
export class ListaTipoActividadesComponent implements OnInit, AfterViewInit, OnDestroy {

  private subs: Subscription[] = [];

  displayedColumns = ['idTipo', 'nombre', 'acciones'];
  datasource = new MatTableDataSource<TipoActividad>();

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private servicio: TipoActividadesService,
    private uiService: UIService,
    public rolService: RoleService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.obtenerTiposActividad();
  }


  private obtenerTiposActividad() {
    this.subs.push(
      this.servicio.obtenerTiposActividad().subscribe(lista => this.datasource.data = lista)
    );
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }


  doFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  agregarTipoActividad() {
    this.subs.push(
      this.dialog
        .open(FormularioTipoActividadesComponent, { ...DIALOG_CONFIG })
        .afterClosed().subscribe(tipo => this.recargarDatos(tipo))
    );

  }

  editarTipoActividad(tipo: TipoActividad) {
    this.subs.push(
      this.dialog
        .open(FormularioTipoActividadesComponent, { ...DIALOG_CONFIG, data: tipo })
        .afterClosed().subscribe(tipo => this.recargarDatos(tipo))
    );

  }

  private recargarDatos(tipo: TipoActividad | undefined): void {
    if (tipo) {
      this.obtenerTiposActividad();
    }
  }



  eliminarTipo(tipo: TipoActividad) {
    const data: ConfirmDialogData = {
      title: "Eliminar Tipo Actividad",
      message: `¿Estás seguro de eliminar el tipo de actividad?`,
      errors: [],
      confirm: "Sí, deseo eliminarlo",
      showCancel: true
    };

    this.subs.push(
      this.dialog.open(ConfirmDialogComponent, { ...DIALOG_CONFIG, data }).afterClosed().subscribe(eliminado => {
        if (eliminado) this.servicio.eliminarTipo(tipo)
          .then(() => {
            this.uiService.mostrarAlerta(`El tipo: ${tipo.nombre} ha sido eliminado con éxito`);
            this.obtenerTiposActividad();
          })
          .catch(err => this.uiService.mostrarError(err));
      })
    );
  }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }


}
