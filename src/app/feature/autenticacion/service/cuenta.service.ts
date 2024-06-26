import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/service/http.service';
import { MiPerfil } from '../model/mi-perfil.model';
import { AppConstants } from 'src/app/shared/app.constants';
import { Observable, lastValueFrom } from 'rxjs';
import { CambioContrasena } from '../model/cambio-contrasena-model';
import { Notificacion } from '../../proyectos/model/notificaciones/notificacion.model';

@Injectable()
export class CuentaService {

  private path = AppConstants.RUTA_CUENTA;
  private notificacionesPath = AppConstants.RUTA_NOTIFICACIONES;
  private pathContrasena = this.path + '/contrasena';
  private pathCorreo = this.path + '/correo';

  constructor(private httpService: HttpService) { }

  cargarMisDatos(idUsuario: number): Promise<MiPerfil> {
    return lastValueFrom(this.httpService.getRequest<MiPerfil>(`${this.path}/${idUsuario}`));
  }

  cargarMisNotificaciones(idUsuario: number): Observable<Notificacion[]> {
    return this.httpService.getRequest<Notificacion[]>(`${this.notificacionesPath}/usuarios/${idUsuario}`);
  }


  editarInformacionBasica(idUsuario: number, perfil: MiPerfil): Promise<MiPerfil> {
    return this.httpService.patchRequest<MiPerfil>(`${this.path}/${idUsuario}`, perfil);
  }

  cambiarContrasena(idUsuario: number, cambioContrasena: CambioContrasena): Promise<boolean> {
    return this.httpService.patchRequest<CambioContrasena, boolean>(`${this.pathContrasena}/${idUsuario}`, cambioContrasena);
  }

  cambiarCorreo(idUsuario: number, data: { idUsuario: number; correoActual: string; correoNuevo: string; }) {
    return this.httpService.patchRequest<unknown, MiPerfil>(`${this.pathCorreo}/${idUsuario}`, data);
  }

  desactivarCuenta(idUsuario: number): Promise<boolean> {
    return this.httpService.deleteRequest<boolean>(`${this.path}/${idUsuario}`);
  }

  crearContrasena(idUsuario: string, contrasena: string, token: string) {
    const data = { contrasena, token };
    return this.httpService.postRequest(`auth/${AppConstants.RUTA_VERIFICAR_CUENTA}/${idUsuario}`, data)
  }

  reiniciarContrasena(contrasena: string, token: string) {
    const data = { contrasena, token };
    return this.httpService.postRequest(`auth/${AppConstants.RUTA_REINICIAR_CLAVE}`, data)
  }


}
