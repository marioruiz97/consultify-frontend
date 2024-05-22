import { Injectable } from '@angular/core';
import { TableroProyectoService } from '../../proyectos/service/tablero-proyecto.service';
import { Actividad } from '../model/actividad.model';
import { HttpService } from 'src/app/core/service/http.service';
import { AppConstants } from 'src/app/shared/app.constants';
import { Observable } from 'rxjs';
import { SeguimientoActividad } from '../model/seguimiento-actividad.model';

@Injectable()
export class GestorActividadesService {

  private idProyecto: number | undefined;

  constructor(private tableroService: TableroProyectoService, private httpService: HttpService) {
    tableroService.tableroActual.subscribe(tablero => {
      if (tablero) {
        this.idProyecto = tablero.infoProyecto.idProyecto;
      }
    });
  }

  get path() {
    const id = this.idProyecto ? this.idProyecto.toString() : "";
    return AppConstants.RUTA_ACTIVIDADES.replace("{idProyecto}", id);
  }

  verificarProyecto(idProyecto: string) {
    if (!this.idProyecto) this.tableroService.obtenerTablero(+idProyecto);
  }

  obtenerActividadPorId(idProyecto: string, id: number): Observable<Actividad> {
    const path = this.idProyecto ? this.path : AppConstants.RUTA_ACTIVIDADES.replace("{idProyecto}", idProyecto);
    return this.httpService.getRequest<Actividad>(`${path}/${id}`);
  }

  crearActividad(actividad: Actividad): Promise<Actividad> {
    return this.httpService.postRequest<Actividad, Actividad>(`${this.path}`, actividad);
  }

  editarActividad(actividad: Actividad): Promise<Actividad> {
    return this.httpService.patchRequest<Actividad>(`${this.path}/${actividad.id}`, actividad);
  }

  eliminarActividad(idActividad: number): Promise<void> {
    return this.httpService.deleteRequest(`${this.path}/${idActividad}`);
  }

  /**
   * GESTION DE SEGUIMIENTOS
   */
  private seguimientoPath(idActividad: number): string {
    return AppConstants.RUTA_SEGUIMIENTOS.replace("{idActividad}", idActividad.toString());
  }

  obtenerSeguimientoActividad(idActividad: number): Observable<SeguimientoActividad[]> {
    return this.httpService.getRequest(this.seguimientoPath(idActividad));
  }

  agregarSeguimientoActividad(comentarios: string, actividad: Actividad): Promise<SeguimientoActividad> {
    return this.httpService.postRequest(this.seguimientoPath(actividad.id), { comentarios, actividad });
  }


}
