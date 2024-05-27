import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/service/http.service';
import { Actividad } from '../model/actividad.model';
import { AppConstants } from 'src/app/shared/app.constants';
import { Observable } from 'rxjs';

@Injectable()
export class MisActividadesService {

  private path = AppConstants.RUTA_MIS_ACTIVIDADES;

  constructor(private httpService: HttpService) { }

  obtenerMisActividades(): Observable<Actividad[]> {
    return this.httpService.getRequest(this.path);
  }

}
