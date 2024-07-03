import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { UIService } from '../service/ui.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  private rutasExcentas: string[] = [
    '/api/v1/tableros/1/posibles-miembros',
    '/api/v1/tipo-actividad?recargar=false',
    '/api/v1/clientes?recargar=false',
    '/cuenta/',
    '/informes/',
  ];


  constructor(private uiService: UIService) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (this.rutasExcentas.filter(ruta => req.url.includes(ruta)).length == 0) this.uiService.estaCargando(true);


    return next.handle(req).pipe(
      finalize(() => {
        this.uiService.estaCargando(false);
      })
    );
  }

}

export const HttpInterceptorProvider = { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true };
