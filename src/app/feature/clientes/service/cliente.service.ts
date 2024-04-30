import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/service/http.service';
import { AppConstants } from 'src/app/shared/app.constants';
import { Cliente } from '../model/cliente.model';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable()
export class ClienteService {

  private path: string = AppConstants.RUTA_CLIENTES;

  constructor(private httpService: HttpService) { }

  obtenerClientes(): Observable<Cliente[]> {
    return this.httpService.getRequest(this.path);
  }

  obtenerClientePorId(idCliente: number): Promise<Cliente> {
    return lastValueFrom(this.httpService.getRequest(`${this.path}/${idCliente}`));
  }

  crearCliente(cliente: Cliente): Promise<Cliente> {
    return this.httpService.postRequest(this.path, cliente);
  }

  editarCliente(idCliente: number, cliente: Cliente): Promise<Cliente> {
    return this.httpService.patchRequest(`${this.path}/${idCliente}`, cliente);
  }


}
