import { Injectable } from "@angular/core";
import { Rol, UsuarioSesion } from "../model/usuario-sesion.model";
import { AuthService } from "./auth.service";


@Injectable({ providedIn: 'root' })
export class RoleService {

  private usuarioSesion: UsuarioSesion | null;

  constructor(private authService: AuthService) {
    this.usuarioSesion = this.authService.obtenerUsuarioSesion();

    this.authService.estaAutenticado.subscribe(autenticado => {
      if (autenticado) {
        this.usuarioSesion = this.authService.obtenerUsuarioSesion();

      } else
        this.usuarioSesion = null;

    });
    this.authService.verificarSesion();
  }

  getRole(): Rol | undefined {
    return this.usuarioSesion?.rol;
  }

  hasRole(rol: string): boolean {
    return this.getRole() == rol;
  }

  hasAnyRole(roles: string[]): boolean {
    let roleCount = 0;

    roles.forEach(rol => roleCount += this.hasRole(rol) ? 1 : 0);

    return roleCount > 0;
  }

}

