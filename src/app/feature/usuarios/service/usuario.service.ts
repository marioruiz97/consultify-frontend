import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { UsuarioLista } from '../model/usuario-lista.model';
import { HttpService } from 'src/app/core/service/http.service';
import { AppConstants } from 'src/app/shared/app.constants';
import { UsuarioEditar } from '../model/usuario-editar.model';
import { UsuarioFormulario } from '../model/usuario-formulario.model';


@Injectable()
export class UsuarioService {

  private path: string = AppConstants.RUTA_USUARIOS;

  constructor(private httpService: HttpService) { }


  desactivar(id: number): Promise<boolean> {
    return this.httpService.deleteRequest<boolean>(`${this.path}/${id}`)
  }

  cambiarEstado(idUsuario: number | undefined, estado: boolean): Observable<any> {
    throw new Error('Method not implemented.');
  }

  obtenerUsuarios(): Observable<UsuarioLista[]> {
    return this.httpService.getRequest(this.path);
  }

  obtenerUsuarioPorId(id: number): Promise<UsuarioEditar> {
    return lastValueFrom(this.httpService.getRequest(`${this.path}/${id}`));
  }

  editarUsuario(idUsuario: number, data: UsuarioFormulario): Promise<UsuarioEditar> {
    return this.httpService.patchRequest(`${this.path}/${idUsuario}`, data);
  }

  crearUsuario(data: UsuarioFormulario): Promise<UsuarioEditar> {
    return this.httpService.postRequest(this.path, data);
  }

}
