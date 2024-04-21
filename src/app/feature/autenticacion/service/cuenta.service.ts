import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/service/http.service';
import { MiPerfil } from '../model/mi-perfil.model';
import { AppConstants } from 'src/app/shared/app.constants';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CuentaService {

  private path = AppConstants.RUTA_CUENTA;

  constructor(private httpService: HttpService) { }


  cargarMisDatos(idUsuario: number): Promise<MiPerfil> {
    return lastValueFrom(this.httpService.getRequest<MiPerfil>(`${this.path}/${idUsuario}`));
  }
  editarInformacionBasica(perfil: any) {
    throw new Error('Method not implemented.');
  }
  desactivarCuenta(identificacion: any) {
    throw new Error('Method not implemented.');
  }

}
