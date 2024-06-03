import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/service/http.service';
import { AppConstants as rutas } from 'src/app/shared/app.constants';
import { Cliente, Contacto } from '../model/cliente.model';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';

@Injectable()
export class ClienteService {

  private path: string = rutas.API_BASE + rutas.RUTA_CLIENTES;

  private listaContactos = new BehaviorSubject<Contacto[]>([]);
  contactos$ = this.listaContactos.asObservable();

  constructor(private httpService: HttpService) {
  }

  /**
   * Clientes
   */

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

  eliminarCliente(idCliente: number): Promise<boolean> {
    return this.httpService.deleteRequest<boolean>(`${this.path}/${idCliente}`);
  }


  /**
   * Contactos
   */

  get contactos(): Contacto[] {
    return this.listaContactos.getValue();
  }

  setContactos(contactos: Contacto[]): void {
    this.listaContactos.next(contactos);
  }

  agregarContacto(nuevoContacto: Contacto) {
    const contactos = [...this.contactos, nuevoContacto];
    this.listaContactos.next(contactos);
  }

  editarContacto(contactoEditado: Contacto) {
    const id = contactoEditado.id;
    const contactos = this.contactos.map(contacto => {
      if (contacto.id === id) {
        return { ...contacto, ...contactoEditado };
      }
      return contacto;
    });
    this.listaContactos.next(contactos);
  }

  eliminarContacto(id: string) {
    const contactos = this.contactos.filter(c => c.id !== id);
    this.listaContactos.next(contactos);
  }

}
