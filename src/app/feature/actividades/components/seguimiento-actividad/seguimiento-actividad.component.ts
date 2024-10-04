import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Actividad } from '../../model/actividad.model';
import { FormControl, Validators } from '@angular/forms';
import { GestorActividadesService } from '../../service/gestor-actividades.service';
import { Persona, SeguimientoActividad } from '../../model/seguimiento-actividad.model';
import { UIService } from 'src/app/core/service/ui.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { UsuarioSesion } from 'src/app/core/model/usuario-sesion.model';
import { RoleService } from 'src/app/core/service/role.service';
import { ConfirmDialogData } from 'src/app/core/model/confirm-dialog-data.model';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { customConfig } from 'src/app/shared/app.constants';

@Component({
  selector: 'app-seguimiento-actividad',
  templateUrl: './seguimiento-actividad.component.html',
  styleUrls: ['./seguimiento-actividad.component.css']
})
export class SeguimientoActividadComponent implements OnInit, OnDestroy {

  private readonly subs: Subscription[] = [];

  private readonly miUsuario: UsuarioSesion | null;
  @Input() actividad!: Actividad;

  comentarios = new FormControl('', [Validators.required, Validators.maxLength(255)]);
  editarComentario = new FormControl('', [Validators.required, Validators.maxLength(255)]);
  seguimientos: SeguimientoActividad[] = [];


  constructor(
    public rolService: RoleService,
    private readonly actividadService: GestorActividadesService,
    private readonly authService: AuthService,
    private readonly uiService: UIService,
    private readonly dialog: MatDialog
  ) {
    this.miUsuario = this.authService.obtenerUsuarioSesion();
  }

  ngOnInit(): void {
    this.obtenerSeguimientos();
  }

  private obtenerSeguimientos() {
    this.subs.push(
      this.actividadService.obtenerSeguimientoActividad(this.actividad.id).subscribe(lista => this.seguimientos = lista)
    );
  }

  nombreCompleto(usuario: Persona): string {
    return usuario.nombreCompleto ? usuario.nombreCompleto : usuario.nombres + ' ' + usuario.apellidos;
  }

  agregarSeguimiento() {
    if (this.comentarios.value && this.comentarios.value !== '') {
      this.actividadService.agregarSeguimientoActividad(this.comentarios.value, this.actividad)
        .then(seguimiento => {
          if (this.miUsuario) seguimiento.usuario = { idUsuario: this.miUsuario.idUsuario, nombres: '', apellidos: '', nombreCompleto: this.miUsuario.nombreCompleto };
          this.uiService.mostrarSnackBar('Seguimiento agregado con exito', 0.5, '');
          this.seguimientos.push(seguimiento);
          this.comentarios.reset('');
          this.comentarios.setErrors(null);
        })
        .catch(err => this.uiService.mostrarError(err));
    }
  }

  habilitarEditar(seguimiento: SeguimientoActividad) {
    this.seguimientos.forEach(seg => seg.editable = false);
    seguimiento.editable = true;
    this.editarComentario.setValue(seguimiento.comentarios);
  }

  descartarCambios(seguimiento: SeguimientoActividad) {
    seguimiento.editable = false;
    this.editarComentario.setValue('');
  }

  editarSeguimiento(seguimiento: SeguimientoActividad) {
    if (this.editarComentario.value && this.editarComentario.value !== '') {
      this.actividadService.editarSeguimientoActividad(this.editarComentario.value, this.actividad, seguimiento)
        .then((respuesta) => {
          this.uiService.mostrarSnackBar('Cambios guardados con éxito', 0.5, '');
          this.descartarCambios(seguimiento);
          seguimiento.comentarios = respuesta.comentarios;
        })
        .catch(err => this.uiService.mostrarError(err));
    }
  }

  eliminarSeguimiento(seguimiento: SeguimientoActividad) {
    const data: ConfirmDialogData = {
      title: "Eliminar Seguimiento",
      message: `¿Estás seguro de eliminar el seguimiento?`,
      errors: [],
      confirm: "Sí, eliminar",
      showCancel: true
    }
    this.subs.push(
      this.dialog.open(ConfirmDialogComponent, { ...customConfig('0vw'), data }).afterClosed().subscribe(eliminado => {
        if (eliminado) this.actividadService.eliminarSeguimiento(this.actividad.id, seguimiento.idSeguimiento)
          .then(() => {
            this.uiService.mostrarSnackBar(`El seguimiento ha sido eliminado con éxito`, 1);
            this.obtenerSeguimientos();
          })
          .catch(err => this.uiService.mostrarError(err));
      }));
  }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
