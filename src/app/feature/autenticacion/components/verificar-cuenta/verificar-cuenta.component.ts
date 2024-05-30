import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/core/service/http.service';
import { UIService } from 'src/app/core/service/ui.service';
import { AppConstants as rutas } from 'src/app/shared/app.constants';

@Component({
  selector: 'app-verificar-cuenta',
  templateUrl: './verificar-cuenta.component.html',
  styleUrls: ['./verificar-cuenta.component.css']
})
export class VerificarCuentaComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  private path = `auth/${rutas.RUTA_VERIFICAR_CUENTA}`;

  procesando = true;
  confirmacionExitosa = false;
  confirmacionFallo = false;

  constructor(
    private httpService: HttpService,
    private uiService: UIService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }


  ngOnInit(): void {
    this.subs.push(
      this.activatedRoute.queryParams.subscribe(params => {
        const token = params['token'];

        if (token) {
          this.httpService.patchRequest<object, string>(this.path, { token })
            .then(() => {
              this.uiService.mostrarSnackBar("Cuenta Verificada!", 1.5);
              this.procesando = false;
              this.confirmacionExitosa = true;
            })
            .catch(err => {
              this.uiService.mostrarError(err)
              this.procesando = false;
              this.confirmacionFallo = true;
            });
        }
        else this.router.navigate([rutas.RUTA_LOGIN]);
      })
    );

  }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
