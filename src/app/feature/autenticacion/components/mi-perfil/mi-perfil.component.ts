import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/service/auth.service';
import { DIALOG_CONFIG } from 'src/app/shared/app.constants';
import { CuentaService } from '../../service/cuenta.service';
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';
import { UsuarioSesion } from 'src/app/core/model/usuario-sesion.model';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent {


  accountForm: FormGroup;
  habilitarCampos = false;
  private usuarioSesion: UsuarioSesion | null
  private identificacion: string;

  constructor(
    private matDialog: MatDialog,
    private cuentaService: CuentaService,
    private authService: AuthService
  ) {
    this.accountForm = this.initForm();
    if (this.authService.verificarSesion()) {
      this.usuarioSesion = this.authService.obtenerUsuarioSesion();
      if (!this.usuarioSesion) this.authService.cerrarSesion();
      this.identificacion = this.usuarioSesion ? this.usuarioSesion.identificacion : "";

    } else {
      this.usuarioSesion = null;
      this.identificacion = "";
      this.authService.cerrarSesion()
    }
  }



  ngOnInit(): void {
    this.cargarInformacionPersonal();
  }


  formatearTelefono(telefono: string) {
    return telefono ? "+57 " + telefono.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3") : "";
  }

  cargarInformacionPersonal() {
    if (this.usuarioSesion) {
      this.setForm(this.usuarioSesion);
    }
  }

  initForm() {
    return new FormGroup({
      nombres: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(40)]),
      apellidos: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(30)]),
      telefono: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(12), Validators.pattern('(^$|[0-9]*)')]),
      nombreUsuario: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(64)]),
      correo: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email, Validators.maxLength(64)]),
      identificacion: new FormControl({ value: '', disabled: true }),
      tipoDocumento: new FormControl({ value: '', disabled: true })
    });
  }

  setForm(perfil: any) {
    const usuario = perfil;
    this.accountForm.setValue({
      nombres: usuario.nombre,
      apellidos: usuario.apellido,
      telefono: usuario.telefono ? usuario.telefono : "3015465076",
      nombreUsuario: usuario.nombreUsuario,
      correo: usuario.correo,
      identificacion: this.identificacion,
      tipoDocumento: "Cédula de ciudadanía"
    });
  }

  toggleEdit() {
    this.habilitarCampos = !this.habilitarCampos;
    if (this.habilitarCampos) {
      this.habilitarCamposFormulario();
    } else {
      this.deshabilitarCamposFormulario();
    }
  }

  habilitarCamposFormulario() {
    const controls = ['nombres', 'apellidos', 'telefono', 'correo'];
    controls.forEach(control => this.accountForm.controls[control].enable());
  }

  deshabilitarCamposFormulario() {
    const controls = ['nombres', 'apellidos', 'telefono', 'correo'];
    controls.forEach(control => this.accountForm.controls[control].disable());
  }


  guardarDatosPersonales() {
    const form = this.accountForm.value;
    const perfil: any = {
      nombres: form.nombres,
      apellidos: form.apellidos,
      telefono: form.telefono,
      nombreUsuario: form.nombreUsuario,
      correo: form.correo,
      identificacion: form.identificacion
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
    const data = {
      title: "Desactivar la cuenta",
      message: `¿Estás seguro de desactivar tu cuenta? <br/> <span class='caption itallic'>Esto no se puede deshacer</span>`,
      errors: [],
      confirm: "Sí, deseo desactivar la cuenta",
      showCancel: true
    }
    this.matDialog.open(ConfirmDialogComponent, { ...DIALOG_CONFIG, data }).afterClosed().subscribe(desactivado => {
      if (desactivado) this.cuentaService.desactivarCuenta(this.identificacion);
    });
  }

}
