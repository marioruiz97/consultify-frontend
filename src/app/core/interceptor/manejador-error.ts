import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { HTTP_ERRORES_CODIGO, ErrorHttp } from './http-codigo-error';

@Injectable()
export class ManejadorError implements ErrorHandler {

  handleError(error: string | Error): void {
    const mensajeError = this.mensajePorDefecto(error);
    this.imprimirErrorConsola(mensajeError);
  }

  private mensajePorDefecto(error: Error | string): string {
    if (error instanceof HttpErrorResponse) {
      if (!navigator.onLine) {
        return HTTP_ERRORES_CODIGO['NO_HAY_INTERNET'];
      }
      if (
        'status' in error &&
        !('mensaje' in error.error)
      ) {
        return this.obtenerErrorHttpCode(error.status);
      }
    }
    return error.toString();
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
    if (httpCode in HTTP_ERRORES_CODIGO) {
      return HTTP_ERRORES_CODIGO['PETICION_FALLIDA'];
    }
    const code: keyof ErrorHttp = httpCode.toString();
    return HTTP_ERRORES_CODIGO[code];
  }
}

export const ErrorHandlerProvider = { provide: ErrorHandler, useClass: ManejadorError };
