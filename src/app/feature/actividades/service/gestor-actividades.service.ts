import { Injectable } from '@angular/core';
import { TableroProyectoService } from '../../proyectos/service/tablero-proyecto.service';
import { Actividad } from '../model/actividad.model';
import { HttpService } from 'src/app/core/service/http.service';
import { AppConstants } from 'src/app/shared/app.constants';

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

  crearActividad(actividad: Actividad): Promise<Actividad> {
    return this.httpService.postRequest<Actividad, Actividad>(`${this.path}`, actividad);
  }

  editarActividad(actividad: Actividad): Promise<Actividad> {
    return this.httpService.patchRequest<Actividad>(`${this.path}/${actividad.id}`, actividad);
  }

  eliminarActividad(idActividad: number): Promise<void> {
    return this.httpService.deleteRequest(`${this.path}/${idActividad}`);
  }

}
