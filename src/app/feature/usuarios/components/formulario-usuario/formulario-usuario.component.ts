import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoDocumentoMap } from '../../model/tipo-documento.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../service/usuario.service';
import { AppConstants as rutas } from 'src/app/shared/app.constants';
import { UIService } from 'src/app/core/service/ui.service';
import { UsuarioFormulario } from '../../model/usuario-formulario.model';
import { ConfirmDialogData } from 'src/app/core/model/confirm-dialog-data.model';
import { RolMap } from 'src/app/core/model/usuario-sesion.model';

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
      activo: new FormControl(false),
      rol: new FormControl(3, [Validators.required])
    });
  }

  private setForm(cuentaUsuario: UsuarioFormulario) {
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
      rol: cuentaUsuario.rol
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

  onSubmit() {
    throw new Error('Method not implemented.');
  }


  ngOnDestroy(): void {
    if (this.suscripciones) { this.suscripciones.forEach(sub => sub.unsubscribe()); }
  }
}
