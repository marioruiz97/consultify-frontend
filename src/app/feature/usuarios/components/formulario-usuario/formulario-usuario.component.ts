import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoDocumentoMap } from '../../model/tipo-documento.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../service/usuario.service';
import { AppConstants as rutas } from 'src/app/shared/app.constants';
import { UIService } from 'src/app/core/service/ui.service';
import { UsuarioEditar } from '../../model/usuario-editar.model';
import { ConfirmDialogData } from 'src/app/core/model/confirm-dialog-data.model';
import { RolMap } from 'src/app/core/model/usuario-sesion.model';
import { UsuarioFormulario } from '../../model/usuario-formulario.model';

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
  styleUrls: ['./formulario-usuario.component.css']
})
export class FormularioUsuarioComponent implements OnDestroy {

  usuarioForm: FormGroup;
  tiposDocumentos = TipoDocumentoMap;
  roles = RolMap;

  private idUsuario = 0;
  private $isEdit = false;

  private suscripciones: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router,
    private uiService: UIService
  ) {
    this.usuarioForm = this.iniciarFormulario();

    this.suscripciones.push(this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== '0') this.obtenerInfoUsuario(+id);
    }));
  }

  get isEdit() {
    return this.$isEdit.valueOf();
  }

  private obtenerInfoUsuario(id: number) {
    this.usuarioService.obtenerUsuarioPorId(id)
      .then(res => {
        if (!res.activo || !res.verificado) {
          const alerta = `${!res.activo ? "El usuario no se encuentra activo. \n" : ""}
              ${!res.verificado ? "El usuario no se encuentra verificado." : ""}`;
          this.uiService.mostrarAlerta(alerta);
        }
        this.setForm(res);
      })
      .catch(err => {
        this.suscripciones.push(
          this.uiService.mostrarError(err).afterClosed()
            .subscribe(() => this.router.navigate([rutas.RUTA_USUARIOS]))
        );
      });
  }


  private iniciarFormulario() {
    return new FormGroup({
      idUsuario: new FormControl({ value: '', disabled: true }),
      tipoDocumento: new FormControl('', [Validators.required]),
      identificacion: new FormControl('', [Validators.required, Validators.min(99999), Validators.max(999999999999999)]),
      nombres: new FormControl('', [Validators.required, Validators.maxLength(64)]),
      apellidos: new FormControl('', [Validators.required, Validators.maxLength(64)]),
      telefono: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern('^(60[0-9]{7})$|^(3[0-9]{9})$')]),
      correo: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(64)]),
      nombreUsuario: new FormControl('', [Validators.required, Validators.maxLength(16), Validators.minLength(4)]),
      activo: new FormControl(),
      rol: new FormControl('', [Validators.required]),
      creadoPor: new FormControl()
    });
  }

  private setForm(cuentaUsuario: UsuarioEditar) {
    const infoUsuario = cuentaUsuario.usuario;
    this.idUsuario = infoUsuario.idUsuario;
    this.$isEdit = true;
    this.usuarioForm.setValue({
      idUsuario: infoUsuario.idUsuario,
      tipoDocumento: infoUsuario.tipoDocumento,
      identificacion: infoUsuario.identificacion,
      nombres: infoUsuario.nombres,
      apellidos: infoUsuario.apellidos,
      telefono: infoUsuario.telefono,
      correo: infoUsuario.correo,
      nombreUsuario: cuentaUsuario.nombreUsuario,
      activo: cuentaUsuario.activo,
      rol: cuentaUsuario.rol,
      creadoPor: cuentaUsuario.creadoPor
    });
  }

  mostrarErrores(): string[] {
    const controls = ['tipoDocumento', 'identificacion', 'nombres', 'apellidos', 'telefono', 'correo', 'nombreUsuario', 'rol'];
    const result: string[] = [];
    controls.forEach(control => {
      if (this.usuarioForm.controls[control].errors !== null) { result.push(control); }
    });
    return result;
  }

  volverAlListado() {
    const data: ConfirmDialogData = {
      title: '¿Cancelar progreso?',
      message: 'Si vuelves perderás los avances del formulario de ingreso',
      errors: [],
      confirm: 'Sí, deseo regresar',
      showCancel: true
    };
    const dialogRef = this.uiService.mostrarConfirmDialog(data);
    this.suscripciones.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate([rutas.RUTA_USUARIOS])
      }
    }));
  }

  /**
   * Método para determinar si se debe crear o actualizar un usuario.
   * 2. valida que si el id del usuario y el currentUser son diferentes de null o undefined entonces se debe actualizar
   * 3. si id es null y currentuser tambien entonces crea el usuario
   */
  onSubmit() {
    const form: UsuarioFormulario = this.usuarioForm.value;
    if (this.idUsuario && this.idUsuario !== 0 && this.$isEdit) {
      this.ejecutarOperacion(this.usuarioService.editarUsuario(this.idUsuario, form));
    } else {
      this.ejecutarOperacion(this.usuarioService.crearUsuario(form));
    }
  }

  private ejecutarOperacion(operacion: Promise<UsuarioEditar>) {
    operacion.then(res => {
      console.log('res ', res)
      this.uiService.mostrarSnackBar("El usuario se ha guardado con exito", 4);
      this.router.navigate([rutas.RUTA_USUARIOS]);
    })
      .catch(err => {
        console.log('err ', err)
        this.uiService.mostrarError(err);
      });
  }


  ngOnDestroy(): void {
    if (this.suscripciones) { this.suscripciones.forEach(sub => sub.unsubscribe()); }
  }
}
