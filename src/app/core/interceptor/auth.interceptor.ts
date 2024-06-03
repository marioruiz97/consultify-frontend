import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { AppConstants as rutas } from 'src/app/shared/app.constants';
import { UIService } from '../service/ui.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private router: Router,
  ) { }

  private retrocederNavegacion = (url: string) => {

    switch (url.split("/")[1]) {
      case rutas.RUTA_USUARIOS: this.router.navigate([rutas.RUTA_USUARIOS]);
        break;

      case rutas.RUTA_CLIENTES: this.router.navigate([rutas.RUTA_CLIENTES]);
        break;

      case rutas.RUTA_PROYECTOS: window.location.reload()
        break;

      default: this.router.navigate([rutas.RUTA_HOME])
    }
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.obtenerToken();
    let authReq = request;

    if (authToken) {
      authReq = request.clone({
        setHeaders: { Authorization: 'Bearer ' + authToken.jwt }
      });
    }

    return next.handle(authReq).pipe(
      catchError(err => {
        console.log('error interceptado', err)

        if (err.status === 401 && this.authService.estaAutenticado.getValue()) {
          this.authService.sesionExpirada(err);
        }

        if (err.status === 403) {
          if (this.router.url !== `/${rutas.RUTA_LOGIN}` && this.authService.haExpiradoToken()) {
            this.authService.sesionExpirada(err)

          } else {
            this.retrocederNavegacion(this.router.url);
            setTimeout(() => this.uiService.mostrarAlerta(`Acceso Denegado. <br/> No tienes acceso a este recurso`), 200);
          }
        }
        return throwError(() => err);
      })
    );
  }

}

export const HttpInterceptorProvider = { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true };
