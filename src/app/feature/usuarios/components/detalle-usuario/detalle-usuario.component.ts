import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { UsuarioService } from '../../service/usuario.service';
import { UsuarioLista as Usuario } from '../../model/usuario-lista.model';
import { Elemento } from '../../model/elemento-usuario.model';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html'
})
export class DetalleUsuarioComponent {


  info: Elemento[] = [];
  private subs: Subscription[] = [];
  clientes = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
    private service: UsuarioService,
    private dialogRef: MatDialogRef<DetalleUsuarioComponent>,
    public auth: AuthService
  ) {
    const doc = data.tipoDocumento;
    this.info.push({ property: 'Id usuario:', data: data.idUsuario });
    this.info.push({ property: 'Tipo de documento:', data: doc });
    this.info.push({ property: 'Identificación:', data: data.identificacion });
    this.info.push({ property: 'Nombre:', data: data.nombre });
    this.info.push({ property: 'Apellidos:', data: `${data.apellido1} ${data.apellido2}` });
    this.info.push({ property: 'Teléfono:', data: data.telefono ? data.telefono : 'No hay teléfono asociado' });
    this.info.push({ property: 'Correo:', data: data.correo });
    this.info.push({ property: 'Estado:', data: data.estado ? 'Activo' : 'Inactivo' });
    //this.info.push({ property: 'Rol(es):', data: data.roles.map(rol => rol.nombreRole.replace('ROLE_', ' ')) });
  }

  ngOnInit() {
    //this.subs.push(this.service.fetchClientes(this.data.idUsuario).subscribe(res => this.clientes = res.body as Cliente[]));
  }

  cambiarEstado() {
    this.subs.push(this.service.cambiarEstado(this.data.idUsuario, this.data.estado).subscribe(res => {
      if (res) { this.closeModal(true); }
    }));
  }

  closeModal(res: boolean = false) {
    if (res) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close();
    }
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(sub => sub.unsubscribe()); }
  }

}
