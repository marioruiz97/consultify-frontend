import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/service/auth.service';
import { DIALOG_CONFIG } from 'src/app/shared/app.constants';
import { CuentaService } from '../../service/cuenta.service';
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent {


  accountForm: FormGroup;
  habilitarCampos = false;
  identificacion: any;

  constructor(
    private matDialog: MatDialog,
    private cuentaService: CuentaService,
    private authService: AuthService
  ) {
    this.accountForm = this.initForm();
  }



  ngOnInit(): void {
    this.cargarInformacionPersonal();
  }


  formatearTelefono(telefono: string) {
    return telefono ? "+57 " + telefono.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3") : "";
  }

  cargarInformacionPersonal() {

  }

  initForm() {
    return new FormGroup({
      nombre: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(40)]),
      apellido: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(30)]),
      direccion: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(50)]),
      telefonoFijo: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(12), Validators.pattern('(^$|[0-9]*)')]),
      celular: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(12), Validators.pattern('(^$|[0-9]*)')]),
      nombreUsuario: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(64)]),
      correo: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email, Validators.maxLength(64)]),
      identificacion: new FormControl({ value: '', disabled: true }),
      tipoDocumento: new FormControl({ value: '', disabled: true })
    });
  }

  setForm(perfil: any) {
    const usuario = perfil.usuario;
    const contacto = usuario.contacto;
    this.accountForm.setValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      direccion: contacto.direccion,
      telefonoFijo: contacto.telefonoFijo,
      celular: contacto.celular,
      nombreUsuario: usuario.nombreUsuario,
      correo: usuario.correo,
      identificacion: usuario.identificacion
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
    const controls = ['nombre', 'apellido', 'direccion', 'telefonoFijo', 'celular', 'correo'];
    controls.forEach(control => this.accountForm.controls[control].enable());
  }

  deshabilitarCamposFormulario() {
    const controls = ['nombre', 'apellido', 'direccion', 'telefonoFijo', 'celular', 'correo'];
    controls.forEach(control => this.accountForm.controls[control].disable());
  }


  guardarDatosPersonales() {
    const form = this.accountForm.value;
    const perfil: any = {
      nombre: form.nombre,
      apellido: form.apellido,
      direccion: form.direccion,
      telefonoFijo: form.telefonoFijo,
      celular: form.celular,
      nombreUsuario: form.nombreUsuario,
      correo: form.correo,
      identificacion: form.identificacion
    };
    this.toggleEdit();
  }



  abrirModalContrasena() {
    /* this.matDialog.open(CambiarContrasenaComponent, { data: { identificacion: this.identificacion } }); */
  }

  verificarCuenta() {
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
