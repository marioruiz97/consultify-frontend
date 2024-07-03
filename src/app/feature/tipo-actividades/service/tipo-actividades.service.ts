import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/service/http.service';
import { TipoActividad } from '../model/tipo-actividad.model';
import { AppConstants } from 'src/app/shared/app.constants';
import { Observable } from 'rxjs';

@Injectable()
export class TipoActividadesService {

  private path = AppConstants.API_BASE + AppConstants.RUTA_TIPO_ACTIVIDAD;

  constructor(private httpService: HttpService) { }


  obtenerTiposActividad(): Observable<TipoActividad[]> {
    return this.httpService.getRequest<TipoActividad[]>(this.path);
  }

  obtenerTiposActividadDropdown(): Observable<TipoActividad[]> {
    return this.httpService.getRequest<TipoActividad[]>(`${this.path}?recargar=false`);
  }

  agregarTipoActividad(tipo: TipoActividad): Promise<TipoActividad> {
    return this.httpService.postRequest<TipoActividad, TipoActividad>(this.path, tipo);
  }

  editarTipoActividad(tipo: TipoActividad): Promise<TipoActividad> {
    return this.httpService.patchRequest<TipoActividad>(`${this.path}/${tipo.idTipo}`, tipo);
  }

  eliminarTipo(tipo: TipoActividad): Promise<void> {
    return this.httpService.deleteRequest<void>(`${this.path}/${tipo.idTipo}`);
  }

}
