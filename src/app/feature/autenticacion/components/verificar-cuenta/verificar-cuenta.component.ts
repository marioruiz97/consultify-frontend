import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/core/service/http.service';
import { UIService } from 'src/app/core/service/ui.service';
import { AppConstants } from 'src/app/shared/app.constants';

@Component({
  selector: 'app-verificar-cuenta',
  templateUrl: './verificar-cuenta.component.html',
  styleUrls: ['./verificar-cuenta.component.css']
})
export class VerificarCuentaComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  private path = AppConstants.RUTA_VERIFICAR_CUENTA;

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
            .then(mensaje => {
              this.uiService.mostrarSnackBar(mensaje, 1.5);
              this.procesando = false;
              this.confirmacionExitosa = true;
            })
            .catch(mensaje => {
              this.uiService.mostrarAlerta(mensaje)
              this.procesando = false;
              this.confirmacionFallo = true;
            });
        }
        else this.router.navigate([AppConstants.RUTA_LOGIN]);
      })
    );

  }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
