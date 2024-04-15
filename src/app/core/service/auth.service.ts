import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { TokenInfo } from "../model/token-info.model";
import { UsuarioSesion } from "../model/usuario-sesion.model";
import { AuthRequest } from "../model/auth-request.model";
import { HttpService } from "./http.service";
import { MockHttpService } from "./mock.http.service";


@Injectable({ providedIn: 'root' })
export class AuthService {

  private usuarioSesion: UsuarioSesion | null;
  private token: TokenInfo | null;
  private $estaAutenticado: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(private router: Router, private httpService: MockHttpService) {
    this.token = null;
    this.usuarioSesion = null;
    this.verificarSesion();
  }

  get estaAutenticado() {
    return this.$estaAutenticado;
  }


  verificarSesion(): boolean {
    // verifica si hay token o sessionStorage
    const sesionActiva = sessionStorage.getItem('token');
    if (!sesionActiva) {
      this.cerrarSesion();
      return false;

    } else {
      //if (!this.token) this.token = new TokenInfo("usuario", atob(sesionActiva));
      //if (!this.usuarioSesion) this.usuarioSesion = this.obtenerUsuarioDesdeToken(this.token);
      this.$estaAutenticado.next(true);
      return true;
    }
  }

  private obtenerUsuarioDesdeToken(token: TokenInfo): UsuarioSesion {
    const payload = JSON.parse(atob(token.jwt.split('.')[1]));
    return new UsuarioSesion(payload.usuario_id, "username", payload.correo, payload.nombre, payload.apellido);
  }

  iniciarSesion(authRequest: AuthRequest) {
    const usuario: UsuarioSesion = this.httpService.loginRequest(authRequest); // servicio mock
    if (usuario) {
      this.usuarioSesion = usuario;
      this.token = new TokenInfo(`${this.usuarioSesion.nombre} ${this.usuarioSesion.apellido}`, "un jwt desde el backend");
      sessionStorage.setItem('token', this.token.jwt);
      this.$estaAutenticado.next(true);
      this.router.navigate(['/home'])
    } else {
      console.log("Verifica los datos de inicio de sesion");
    }
  }

  cerrarSesion() {
    // this.uiService.showSnackBar('Se ha cerrado sesión', 3)
    this.token = null;
    this.usuarioSesion = null;
    this.$estaAutenticado.next(false);
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  recuperarContrasena() {
    // TODO document why this method 'recuperarContrasena' is empty


  }

  sesionExpirada() {
    // this.uiService.showConfirm({ title: 'La sesión ha expirado!', message: 'Ingresa al sistema nuevamente', confirm: 'Ok' })
    this.cerrarSesion();
  }

}
