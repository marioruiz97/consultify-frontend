import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/service/http.service';
import { MiPerfil } from '../model/mi-perfil.model';
import { AppConstants } from 'src/app/shared/app.constants';
import { lastValueFrom } from 'rxjs';
import { CambioContrasena } from '../model/cambio-contrasena-model';

@Injectable()
export class CuentaService {

  private path = AppConstants.RUTA_CUENTA;
  private pathContrasena = this.path + '/contrasena';

  constructor(private httpService: HttpService) { }

  cargarMisDatos(idUsuario: number): Promise<MiPerfil> {
    return lastValueFrom(this.httpService.getRequest<MiPerfil>(`${this.path}/${idUsuario}`));
  }

  editarInformacionBasica(idUsuario: number, perfil: MiPerfil): Promise<MiPerfil> {
    return this.httpService.patchRequest<MiPerfil>(`${this.path}/${idUsuario}`, perfil);
  }

  cambiarContrasena(idUsuario: number, cambioContrasena: CambioContrasena): Promise<boolean> {
    return this.httpService.patchRequest<CambioContrasena, boolean>(`${this.pathContrasena}/${idUsuario}`, cambioContrasena);
  }

  desactivarCuenta(idUsuario: number): Promise<boolean> {
    return this.httpService.deleteRequest<boolean>(`${this.path}/${idUsuario}`);
  }

}
