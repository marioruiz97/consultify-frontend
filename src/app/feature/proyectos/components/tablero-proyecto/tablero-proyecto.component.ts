import { Component } from '@angular/core';
import { UIService } from 'src/app/core/service/ui.service';
import { TableroProyectoService } from '../../service/tablero-proyecto.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TableroProyecto } from '../../model/tablero/tablero-proyecto.model';
import { Cliente } from 'src/app/feature/clientes/model/cliente.model';
import { TipoDocumentoMap } from 'src/app/feature/usuarios/model/tipo-documento.model';
import { InfoProyecto } from '../../model/info-proyecto.model';
import { MatDialog } from '@angular/material/dialog';
import { FormularioProyectoComponent } from '../formulario-proyecto/formulario-proyecto.component';
import { customConfig } from 'src/app/shared/app.constants';
import { GestionarMiembrosProyectoComponent } from '../gestionar-miembros-proyecto/gestionar-miembros-proyecto.component';

@Component({
  selector: 'app-tablero-proyecto',
  templateUrl: './tablero-proyecto.component.html',
  styleUrls: ['./tablero-proyecto.component.css']
})
export class TableroProyectoComponent {

  private infoTablero: TableroProyecto | undefined;
  private idProyecto = 0;
  private subs: Subscription[] = [];

  datosCargados = false;


  constructor(
    private uiService: UIService,
    private servicioTablero: TableroProyectoService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.subs.push(this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== '0') {
        this.idProyecto = +id;
        this.servicioTablero.obtenerTablero(this.idProyecto).subscribe(tableroActual => this.infoTablero = tableroActual);
        this.datosCargados = true;
      }
    }));
  }


  get cliente(): Cliente | undefined {
    return this.proyecto?.clienteProyecto;
  }
  get proyecto(): InfoProyecto | undefined {
    return this.infoTablero?.infoProyecto;
  }

  tipoDocumento(tipo: string) {
    return TipoDocumentoMap.get(tipo);
  }

  abrirGestionarMiembro() {
    const data = this.proyecto?.miembros;
    this.dialog.open(GestionarMiembrosProyectoComponent, { data, ...customConfig('50vw', '60vh') });
  }

  abrirEditarFormulario() {
    const data = this.infoTablero?.infoProyecto;
    const dialogRef = this.dialog.open(FormularioProyectoComponent, { data, ...customConfig('60vw'), disableClose: true });
    this.subs.push(dialogRef.afterClosed().subscribe(recargar => { if (recargar) this.servicioTablero.obtenerTablero(this.idProyecto) }));
  }

  abrirCambiarEstado() {
    throw new Error('Method not implemented.');
  }

}
