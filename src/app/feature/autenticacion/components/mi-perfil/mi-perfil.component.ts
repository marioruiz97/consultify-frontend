import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/service/auth.service';
import { AppConstants, DIALOG_CONFIG } from 'src/app/shared/app.constants';
import { CuentaService } from '../../service/cuenta.service';
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from 'src/app/core/model/confirm-dialog-data.model';
import { MiPerfil } from '../../model/mi-perfil.model';
import { TipoDocumentoMap } from 'src/app/feature/usuarios/model/tipo-documento.model';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent {

  rutaHome = AppConstants.RUTA_HOME;

  accountForm: FormGroup;
  habilitarCampos = false;

  private miPerfil = new MiPerfil();
  private idUsuario = 0;

  constructor(
    private matDialog: MatDialog,
    private cuentaService: CuentaService,
    private authService: AuthService
  ) {
    this.accountForm = this.initForm();
    if (this.authService.verificarSesion()) {
      const usuarioSesion = this.authService.obtenerUsuarioSesion();
      if (!usuarioSesion) this.authService.cerrarSesion();
      else this.idUsuario = usuarioSesion.idUsuario;
      this.cargarInformacionPersonal();
    } else {
      this.authService.cerrarSesion()
    }
  }


  private cargarInformacionPersonal() {
    this.cuentaService.cargarMisDatos(this.idUsuario)
      .then(perfil => {
        this.miPerfil = perfil;
        this.setForm(this.miPerfil);
      });
  }

  private initForm() {
    return new FormGroup({
      nombres: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(64)]),
      apellidos: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(64)]),
      telefono: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(10), Validators.pattern('^(60[0-9]{7})$|^(3[0-9]{9})$')]),
      nombreUsuario: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(16), Validators.minLength(4)]),
      correo: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email, Validators.maxLength(64)]),
      identificacion: new FormControl({ value: '', disabled: true }),
      tipoDocumento: new FormControl({ value: '', disabled: true }),
      rol: new FormControl({ value: '', disabled: true })
    });
  }

  private setForm(perfil: MiPerfil) {
    this.accountForm.setValue({
      nombres: perfil.nombres,
      apellidos: perfil.apellidos,
      telefono: this.formatearTelefono(perfil.telefono),
      nombreUsuario: perfil.nombreUsuario,
      correo: perfil.correo,
      identificacion: perfil.identificacion,
      tipoDocumento: TipoDocumentoMap.get(perfil.tipoDocumento),
      rol: perfil.rol
    });
  }

  private formatearTelefono(telefono: string) {
    return telefono ? "+57 " + telefono.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3") : "";
  }

  toggleEdit() {
    this.habilitarCampos = !this.habilitarCampos;
    if (this.habilitarCampos) {
      this.habilitarCamposFormulario();
    } else {
      this.deshabilitarCamposFormulario();
    }
  }

  private habilitarCamposFormulario() {
    const controls = ['nombres', 'apellidos', 'telefono', 'correo', 'nombreUsuario'];
    controls.forEach(control => this.accountForm.controls[control].enable());
  }

  private deshabilitarCamposFormulario() {
    const controls = ['nombres', 'apellidos', 'telefono', 'correo', 'nombreUsuario'];
    controls.forEach(control => this.accountForm.controls[control].disable());
  }


  guardarDatosPersonales() {
    const form = this.accountForm.value;
    const perfil: MiPerfil = {
      nombres: form.nombres,
      apellidos: form.apellidos,
      telefono: form.telefono,
      nombreUsuario: form.nombreUsuario,
      correo: form.correo,
      identificacion: this.miPerfil.identificacion,
      tipoDocumento: this.miPerfil.tipoDocumento,
      rol: this.miPerfil.rol
    };
    this.toggleEdit();
    this.cuentaService.editarInformacionBasica(perfil);
  }



  abrirModalContrasena() {
    /* this.matDialog.open(CambiarContrasenaComponent, { data: { identificacion: this.identificacion } }); */
  }

  cambiarCorreo() {
    alert('se enviará un correo electrónico para verificar la cuenta')
  }

  desactivarCuenta() {
    const data: ConfirmDialogData = {
      title: "Desactivar la cuenta",
      message: `¿Estás seguro de desactivar tu cuenta? <br/> <span class='caption itallic'>Esto no se puede deshacer</span>`,
      errors: [],
      confirm: "Sí, deseo desactivar la cuenta",
      showCancel: true
    }
    this.matDialog.open(ConfirmDialogComponent, { ...DIALOG_CONFIG, data }).afterClosed().subscribe(desactivado => {
      if (desactivado) this.cuentaService.desactivarCuenta(this.idUsuario);
    });
  }

}
