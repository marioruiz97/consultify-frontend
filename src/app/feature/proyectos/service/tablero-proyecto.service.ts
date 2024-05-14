import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from 'src/app/core/service/http.service';
import { UIService } from 'src/app/core/service/ui.service';
import { TableroProyecto } from '../model/tablero/tablero-proyecto.model';
import { AppConstants } from 'src/app/shared/app.constants';
import { MiembroProyecto } from '../model/miembros/miembro-proyecto.model';

@Injectable()
export class TableroProyectoService {

  private $TableroActual: BehaviorSubject<TableroProyecto | undefined> = new BehaviorSubject<TableroProyecto | undefined>(undefined);
  private tableroPath = AppConstants.RUTA_TABLEROS;

  constructor(
    private httpService: HttpService,
    private uiService: UIService
  ) { }

  public get tableroActual() {
    return this.$TableroActual.asObservable();
  }

  private get id() {
    return this.$TableroActual.getValue()?.infoProyecto.idProyecto
  }

  obtenerTablero(idProyecto: number): Observable<TableroProyecto | undefined> {
    this.httpService.getRequest<TableroProyecto>(`${this.tableroPath}/${idProyecto}`).subscribe({
      next: (tablero) => this.$TableroActual.next(tablero),
      error: (err) => this.uiService.mostrarError(err)
    })
    return this.tableroActual;
  }

  /**
   * GESTIÓN DE MIEMBROS
   *
   */
  obtenerPosiblesMiembros(): Observable<MiembroProyecto[]> {
    const id = this.id;
    return this.httpService.getRequest<MiembroProyecto[]>(`${this.tableroPath}/${id}/posibles-miembros`);
  }

  async agregarMiembro(data: { usuario: MiembroProyecto }): Promise<boolean> {
    const id = this.id;
    const miembro = data.usuario;

    const result =
      await this.httpService.putRequest<MiembroProyecto>(`${this.tableroPath}/${id}/miembros`, miembro)
        .then(miembro => {
          this.uiService.mostrarSnackBar(`Se ha agregado a ${miembro.usuario.nombres} ${miembro.usuario.apellidos} a la lista de miembros`, 3);
          const tablero: TableroProyecto | undefined = this.$TableroActual.getValue();
          if (tablero) {
            tablero.infoProyecto.miembros.push(miembro);
            this.$TableroActual.next(tablero);
          }
          return true;
        })
        .catch(err => { this.uiService.mostrarError(err); return false; });

    return result;
  }

  async quitarMiembro(miembro: MiembroProyecto): Promise<MiembroProyecto[]> {
    const id = this.id;

    const miembros =
      await this.httpService.deleteRequest<MiembroProyecto[]>(`${this.tableroPath}/${id}/miembros/${miembro.usuario.idUsuario}`)
        .then(miembros => {
          this.uiService.mostrarSnackBar(`Se ha eliminado a ${miembro.usuario.nombres} ${miembro.usuario.apellidos} de la lista de miembros`, 3);
          const tablero: TableroProyecto | undefined = this.$TableroActual.getValue();
          if (tablero) {
            tablero.infoProyecto.miembros = miembros;
            this.$TableroActual.next(tablero);
          }
          return miembros;
        })
        .catch(err => { this.uiService.mostrarError(err); return []; });

    return miembros;
  }

}
