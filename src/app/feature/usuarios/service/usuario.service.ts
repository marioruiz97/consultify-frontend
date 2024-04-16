import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioLista } from '../model/usuario-lista.model';

@Injectable()
export class UsuarioService {


  constructor() { }


  delete(id: string): Observable<any> {
    throw new Error('Method not implemented.');
  }
  cambiarEstado(idUsuario: number | undefined, estado: boolean): Observable<any> {
    throw new Error('Method not implemented.');
  }
  obtenerUsuarios(): Observable<UsuarioLista[]> {
    throw new Error('Method not implemented.');
  }

}
