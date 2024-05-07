import { Component } from '@angular/core';
import { InfoProyecto } from '../../model/info-proyecto.model';
import { Subject, Subscription } from 'rxjs';
import { FilterData } from './filter/model/filter-data.model';
import { ProyectoService } from '../../service/proyecto.service';
import { FormularioProyectoComponent } from '../formulario-proyecto/formulario-proyecto.component';
import { MatDialog } from '@angular/material/dialog';
import { DIALOG_CONFIG, customConfig } from 'src/app/shared/app.constants';
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from 'src/app/core/model/confirm-dialog-data.model';
import { UIService } from 'src/app/core/service/ui.service';

@Component({
  selector: 'app-lista-proyectos',
  templateUrl: './lista-proyectos.component.html',
  styleUrls: ['./lista-proyectos.component.css']
})
export class ListaProyectosComponent {

  private subs: Subscription[] = [];
  private proyectos: InfoProyecto[] = [];
  proyectosFiltrados = new Subject<InfoProyecto[]>();
  mostrarFiltros = false;

  constructor(
    private servicioProyecto: ProyectoService,
    private dialog: MatDialog,
    private uiService: UIService
  ) {
    this.obtenerProyectos();
  }


  private obtenerProyectos() {
    this.subs.push(this.servicioProyecto.obtenerProyectos().subscribe(res => {
      this.proyectos = res as InfoProyecto[];
      this.proyectosFiltrados.next(this.proyectos);
    }));
  }

  abrirFormulario() {
    this.dialog.open(FormularioProyectoComponent, { ...customConfig('80vw', '80vh'), disableClose: true });
  }


  filtrar(filtros: FilterData) {
    const result = this.proyectos.filter(pr => {
      const filtroCliente = filtros.cliente ? filtros.cliente.trim().toLowerCase() : undefined;
      const filtroNombre = filtros.nombreProyecto ? filtros.nombreProyecto.trim().toLowerCase() : undefined;

      const filtro1 = !(filtroNombre && !pr.nombreProyecto.trim().toLowerCase().includes(filtroNombre));
      const filtro2 = !(filtroCliente && !pr.clienteProyecto.razonSocial.trim().toLowerCase().includes(filtroCliente));
      /* const filtro3 = !(filtros.desde && new Date(pr.createdDate) < filtros.desde); */
      return filtro1 && filtro2;
    }).slice();
    this.proyectosFiltrados.next(result);
  }

  eliminarFiltros() {
    this.mostrarFiltros = false;
    this.proyectosFiltrados.next(this.proyectos);
  }

  eliminarProyecto(proyecto: InfoProyecto) {
    const data: ConfirmDialogData = {
      title: "Eliminar Proyecto",
      message: `¿Estás seguro de eliminar el proyecto?`,
      errors: [],
      confirm: "Sí, deseo eliminar el proyecto",
      showCancel: true
    }
    this.subs.push(this.dialog.open(ConfirmDialogComponent, { ...DIALOG_CONFIG, data }).afterClosed().subscribe(eliminado => {
      if (eliminado) this.servicioProyecto.eliminarProyecto(proyecto.idProyecto)
        .then(res => {
          if (res) {
            this.uiService.mostrarAlerta(`El proyecto ${proyecto.nombreProyecto} ha sido eliminado con éxito`);
            this.obtenerProyectos();
          }
        })
        .catch(err => this.uiService.mostrarError(err));
    }));
  }

}
