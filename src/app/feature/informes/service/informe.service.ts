import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/service/http.service';
import { InformeProyecto } from '../model/informe-proyecto.model';
import { AppConstants } from 'src/app/shared/app.constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable()
export class InformeService {

  private apiEndpoint = AppConstants.API_ENDPOINT;
  private informesPath = AppConstants.RUTA_INFORMES;


  constructor(private httpService: HttpService, private httpClient: HttpClient) {
  }

  obtenerProyectos(): Observable<InformeProyecto[]> {
    return this.httpService.getRequest(this.informesPath);
  }

  cargarInformeProyecto(idProyecto: number): Observable<InformeProyecto> {
    return this.httpService.getRequest(`${this.informesPath}/${idProyecto}`);
  }

  exportarReporte(idProyecto: number, formato: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': formato == 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    return this.httpClient.get(`${this.apiEndpoint}/${this.informesPath}/exportar/${idProyecto}?format=${formato}`, {
      headers: headers,
      responseType: 'blob'
    });
  }


}
