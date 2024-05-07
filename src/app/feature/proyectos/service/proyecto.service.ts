import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/core/service/http.service';
import { AppConstants } from 'src/app/shared/app.constants';
import { InfoProyecto } from '../model/info-proyecto.model';
import { NuevoProyecto } from '../model/nuevo-proyecto.model';

@Injectable()
export class ProyectoService {

  private proyectoPath = AppConstants.RUTA_PROYECTOS;

  constructor(private httpService: HttpService) { }

  obtenerProyectos(): Observable<InfoProyecto[]> {
    return this.httpService.getRequest(this.proyectoPath);
  }

  obtenerProyectoPorId(id: number): Promise<InfoProyecto> {
    return lastValueFrom(this.httpService.getRequest(`${this.proyectoPath}/${id}`));
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

