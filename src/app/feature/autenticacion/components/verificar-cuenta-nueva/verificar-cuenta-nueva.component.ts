import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/core/service/ui.service';
import { AppConstants } from 'src/app/shared/app.constants';
import { CuentaService } from '../../service/cuenta.service';

@Component({
  selector: 'app-verificar-cuenta-nueva',
  templateUrl: './verificar-cuenta-nueva.component.html',
  styleUrls: ['./verificar-cuenta-nueva.component.css']
})
export class VerificarCuentaNuevaComponent implements OnDestroy {

  private subs: Subscription[] = [];
  private token: string | undefined;
  private idUsuario: string | undefined;

  formulario: FormGroup;
  ocultarContrasenas = true;

  constructor(
    private cuentaService: CuentaService,
    private uiService: UIService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

    this.subs.push(
      this.activatedRoute.queryParams.subscribe(params => {
        const token = params['token'];

        if (token) this.token = token;
        else router.navigate([AppConstants.RUTA_LOGIN]);
      })
    );

    this.subs.push(
      this.activatedRoute.paramMap.subscribe(params => {
        const idUsuario = params.get('id');

        if (idUsuario) this.idUsuario = idUsuario;
      })
    );

    this.formulario = this.iniciarFormulario();

  }


  iniciarFormulario(): FormGroup {
    return new FormGroup({
      contrasena: new FormControl('', [Validators.required, Validators.pattern(AppConstants.PATRON_CONTRASENA)]),
      confirmar: new FormControl('', [Validators.required, Validators.pattern(AppConstants.PATRON_CONTRASENA)]),
    });
  }

  reiniciarContrasena() {
    const form = this.formulario.value;
    if (form.contrasena !== form.confirmar) this.uiService.mostrarSnackBar('Las contraseñas no coinciden', 1.5);
    if (form.contrasena === form.confirmar && this.token && this.idUsuario) {
      this.cuentaService.crearContrasena(this.idUsuario, form.contrasena, this.token)
        .then(() => {
          this.uiService.mostrarSnackBar("Se ha reiniciado la clave correctamente", 2);
          this.router.navigate([AppConstants.RUTA_LOGIN]);
        })
        .catch(err => this.uiService.mostrarError(err));
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
