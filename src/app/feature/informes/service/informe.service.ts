import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/service/http.service';
import { InformeProyecto } from '../model/informe-proyecto.model';
import { AppConstants } from 'src/app/shared/app.constants';



@Injectable()
export class InformeService {

  private informesPath = AppConstants.RUTA_INFORMES;


  constructor(private httpService: HttpService) {
  }

  obtenerProyectos(): Observable<InformeProyecto[]> {
    return this.httpService.getRequest(this.informesPath);
  }

  cargarInformeProyecto(idProyecto: number): Observable<InformeProyecto> {
    return this.httpService.getRequest(`${this.informesPath}/${idProyecto}`);
  }


}
