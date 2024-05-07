import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/service/auth.service';
import { UsuarioLista as Usuario } from '../../model/usuario-lista.model';
import { Elemento } from '../../model/elemento-usuario.model';
import { TipoDocumentoMap } from '../../model/tipo-documento.model';
import { RolMap } from 'src/app/core/model/usuario-sesion.model';
import * as moment from 'moment';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html'
})
export class DetalleUsuarioComponent {


  infoUsuario: Elemento[] = [];
  infoCuenta: Elemento[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
    private dialogRef: MatDialogRef<DetalleUsuarioComponent>,
    public auth: AuthService
  ) {
    this.infoUsuario.push({ property: 'Id usuario:', data: data.idUsuario });
    this.infoUsuario.push({ property: 'Tipo de documento:', data: TipoDocumentoMap.get(data.tipoDocumento.toString()) });
    this.infoUsuario.push({ property: 'Identificación:', data: data.identificacion });
    this.infoUsuario.push({ property: 'Nombre:', data: data.nombres });
    this.infoUsuario.push({ property: 'Apellidos:', data: data.apellidos });
    this.infoUsuario.push({ property: 'Teléfono:', data: data.telefono ? this.formatearTelefono(data.telefono) : 'No hay teléfono asociado' });
    this.infoUsuario.push({ property: 'Correo:', data: data.correo });

    this.infoCuenta.push({ property: 'Nombre de usuario:', data: data.nombreUsuario });
    this.infoCuenta.push({ property: 'Estado:', data: data.estado ? 'Activo' : 'Inactivo' });
    this.infoCuenta.push({ property: 'Rol:', data: this.mostrarRol(data.rol.toString()) });
    this.infoCuenta.push({ property: 'Creado Por:', data: data.creadoPor });
    this.infoCuenta.push({ property: 'Último Inicio:', data: moment(data.ultimoInicio).format('DD/MMM/YYYY HH:mm:ss') });
  }

  private formatearTelefono(telefono: string) {
    return telefono ? "+57 " + telefono.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3") : "";
  }

  private mostrarRol(rol: string) {
    return RolMap.get(rol);
  }


  closeModal(res = false) {
    if (res) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close();
    }
  }

}
