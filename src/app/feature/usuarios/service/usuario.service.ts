import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioLista } from '../model/usuario-lista.model';
import { HttpService } from 'src/app/core/service/http.service';
import { AppConstants } from 'src/app/shared/app.constants';

@Injectable()
export class UsuarioService {

  private path: string = AppConstants.RUTA_USUARIOS;


  constructor(private httpService: HttpService) { }


  delete(id: string): Observable<any> {
    throw new Error('Method not implemented.');
  }

  cambiarEstado(idUsuario: number | undefined, estado: boolean): Observable<any> {
    throw new Error('Method not implemented.');
  }

  obtenerUsuarios(): Observable<UsuarioLista[]> {
    return this.httpService.getRequest(this.path);
  }

}
