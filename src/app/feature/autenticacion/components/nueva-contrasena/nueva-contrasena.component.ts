import { Component } from '@angular/core';
import { CuentaService } from '../../service/cuenta.service';
import { UIService } from 'src/app/core/service/ui.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstants } from 'src/app/shared/app.constants';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-nueva-contrasena',
  templateUrl: './nueva-contrasena.component.html',
  styleUrls: ['./nueva-contrasena.component.css']
})
export class NuevaContrasenaComponent {

  private subs: Subscription[] = [];
  private token: string | undefined;

  formulario: FormGroup;
  ocultarContrasenas = true;

  constructor(
    private authService: AuthService,
    private cuentaService: CuentaService,
    private uiService: UIService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    if (this.authService.estaAutenticado.value) this.router.navigate([AppConstants.RUTA_HOME]);

    this.subs.push(
      this.activatedRoute.queryParams.subscribe(params => {
        const token = params['token'];

        if (token) this.token = token;
        else router.navigate([AppConstants.RUTA_LOGIN]);
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
    if (form.contrasena === form.confirmar && this.token) {
      this.cuentaService.reiniciarContrasena(form.contrasena, this.token)
        .then(() => {
          this.uiService.mostrarSnackBar("Se ha reiniciado la clave correctamente", 2);
          this.router.navigate([AppConstants.RUTA_LOGIN]);
        })
        .catch(err => this.uiService.mostrarError(err));
    }
  }

}
