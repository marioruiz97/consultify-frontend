import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { TokenInfo } from "../model/token-info.model";
import { UsuarioSesion } from "../model/usuario-sesion.model";
import { AuthRequest } from "../model/auth-request.model";
import { HttpService } from "./http.service";
import { AppConstants as rutas } from "src/app/shared/app.constants";
import { UIService } from "./ui.service";
import { HttpErrorResponse } from "@angular/common/http";


@Injectable({ providedIn: 'root' })
export class AuthService {

  private usuarioSesion: UsuarioSesion | null;
  private token: TokenInfo | null;
  private $estaAutenticado: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(private router: Router, private httpService: HttpService, private uiService: UIService) {
    this.token = null;
    this.usuarioSesion = null;
  }

  get estaAutenticado() {
    return this.$estaAutenticado;
  }

  obtenerUsuarioSesion(): UsuarioSesion | null {
    return this.usuarioSesion;
  }

  obtenerToken() {
    if (this.verificarSesion()) return this.token;
    return null;
  }

  verificarSesion(): boolean {
    const sesionActiva = sessionStorage.getItem('token');
    if (!sesionActiva || (sesionActiva.valueOf() !== this.token?.jwt)) {
      return false;

    } else {
      if (!this.token) this.token = new TokenInfo(sesionActiva);
      if (!this.usuarioSesion) this.usuarioSesion = this.obtenerUsuarioDesdeToken(this.token.jwt);
      this.$estaAutenticado.next(true);
      return true;
    }
  }


  iniciarSesion(authRequest: AuthRequest) {
    this.httpService.loginRequest(authRequest)
      .then(res => {
        if (res) {
          this.configurarSesion(res.jwt);
          this.$estaAutenticado.next(true);
          this.router.navigate([rutas.RUTA_HOME])
        }
      })
      .catch(err => {
        console.log('falló el inicio de sesion', err);
        if (!err.error) err.error = { status: '401', error: 'Falló el inicio de sesión', message: 'Por favor revisa el usuario/contraseña' }
        this.uiService.mostrarError(err);
        this.limpiarDatosSesion();
      });
  }

  private configurarSesion(jwt: string) {
    this.token = new TokenInfo(jwt);
    this.usuarioSesion = this.obtenerUsuarioDesdeToken(jwt);
    sessionStorage.removeItem('token');
    sessionStorage.setItem('token', jwt);
  }

  private limpiarDatosSesion() {
    this.token = null;
    this.usuarioSesion = null;
    this.$estaAutenticado.next(false);
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    this.router.navigate([rutas.RUTA_LOGIN]);
  }

  private obtenerUsuarioDesdeToken(token: string): UsuarioSesion {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return new UsuarioSesion(payload.idUsuario, payload.identificacion, payload.nombreUsuario, payload.correo, payload.nombreCompleto, payload.rol);
  }

  sesionExpirada(error: HttpErrorResponse | null) {
    if (error != null) this.uiService.mostrarError(error);
    else this.uiService.mostrarConfirmDialog({ title: 'La sesión ha expirado!', message: 'Ingresa al sistema nuevamente', errors: [], confirm: 'Ok', showCancel: false })
    this.limpiarDatosSesion();
  }

  cerrarSesion() {
    this.uiService.mostrarSnackBar('Se ha cerrado sesión', 3)
    this.limpiarDatosSesion();
  }

  recuperarContrasena() {
    // TODO document why this method 'recuperarContrasena' is empty


  }


}
