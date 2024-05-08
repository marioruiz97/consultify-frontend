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
import { UIService } from '../service/ui.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AppConstants as rutas } from 'src/app/shared/app.constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private uiService: UIService, private router: Router, private location: Location) { }

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
          if (this.router.url !== `/${rutas.RUTA_LOGIN}`) {
            if (this.authService.haExpiradoToken()) {
              this.authService.sesionExpirada(err)
            } else {
              this.router.navigate([rutas.RUTA_HOME]);
              setTimeout(() => this.uiService.mostrarAlerta(`Acceso Denegado. <br/> No tienes acceso a este recurso`), 200);
            }
          }
        }
        return throwError(() => err);
      })
    );
  }

}

export const HttpInterceptorProvider = { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true };
