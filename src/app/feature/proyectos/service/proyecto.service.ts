import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/service/http.service';
import { AppConstants as rutas } from 'src/app/shared/app.constants';
import { InfoProyecto } from '../model/info-proyecto.model';
import { NuevoProyecto } from '../model/nuevo-proyecto.model';

@Injectable()
export class ProyectoService {

  private proyectoPath = rutas.API_BASE + rutas.RUTA_PROYECTOS;
  private misProyectosPath = rutas.API_BASE + rutas.RUTA_MIS_PROYECTOS;

  constructor(private httpService: HttpService) { }

  obtenerProyectos(): Observable<InfoProyecto[]> {
    return this.httpService.getRequest(this.proyectoPath);
  }


  obtenerMisProyectos(): Observable<InfoProyecto[]> {
    return this.httpService.getRequest(this.misProyectosPath);
  }

  crearProyecto(data: NuevoProyecto): Promise<InfoProyecto> {
    return this.httpService.postRequest<NuevoProyecto, InfoProyecto>(this.proyectoPath, data);
  }

  editarProyecto(idProyecto: number, data: NuevoProyecto): Promise<InfoProyecto> {
    return this.httpService.patchRequest<NuevoProyecto, InfoProyecto>(`${this.proyectoPath}/${idProyecto}`, data);
  }

  eliminarProyecto(idProyecto: number): Promise<boolean> {
    return this.httpService.deleteRequest<boolean>(`${this.proyectoPath}/${idProyecto}`);
  }
}

