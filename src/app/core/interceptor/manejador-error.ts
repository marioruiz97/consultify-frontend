import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { HTTP_ERRORES_CODIGO, ErrorHttp } from './http-codigo-error';

@Injectable()
export class ManejadorError implements ErrorHandler {
  constructor() { }

  handleError(error: string | Error): void {
    const mensajeError = this.mensajePorDefecto(error);
    this.imprimirErrorConsola(mensajeError);
  }

  private mensajePorDefecto(error: any): string {
    if (error instanceof HttpErrorResponse) {
      if (!navigator.onLine) {
        return HTTP_ERRORES_CODIGO['NO_HAY_INTERNET'];
      }
      if (
        error.hasOwnProperty('status') &&
        !error.error.hasOwnProperty('mensaje')
      ) {
        return this.obtenerErrorHttpCode(error.status);
      }
    }
    return error;
  }

  private imprimirErrorConsola(mensaje: string): void {
    const respuesta = {
      fecha: new Date().toLocaleString(),
      path: window.location.href,
      mensaje,
    };
    console.log(respuesta);
  }

  public obtenerErrorHttpCode(httpCode: number): string {
    if (HTTP_ERRORES_CODIGO.hasOwnProperty(httpCode)) {
      return HTTP_ERRORES_CODIGO['PETICION_FALLIDA'];
    }
    const code: keyof ErrorHttp = httpCode.toString();
    return HTTP_ERRORES_CODIGO[code];
  }
}
