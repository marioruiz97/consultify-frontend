import { Injectable } from "@angular/core";
import { Rol, UsuarioSesion } from "../model/usuario-sesion.model";
import { AuthService } from "./auth.service";
import { Actividad } from "src/app/feature/actividades/model/actividad.model";
import { SeguimientoActividad } from "src/app/feature/actividades/model/seguimiento-actividad.model";


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

  rolRequerido(roles: string[]) {
    // return true si no se envia ningun rol
    if (roles.length === 0) return true;

    return this.hasAnyRole(roles);
  }

  puedeEditarActividad(actividad: Actividad): boolean {
    const esResponsable = this.usuarioSesion?.idUsuario === actividad.responsable.idUsuario;
    return this.hasRole("ROLE_ADMIN") || esResponsable;
  }

  puedeEliminarActividad(actividad: Actividad): boolean {
    const esResponsable = this.usuarioSesion?.idUsuario === actividad.responsable.idUsuario;
    return this.hasRole("ROLE_ADMIN") || esResponsable;
  }

  esDuenoSeguimiento(seguimiento: SeguimientoActividad): boolean {
    // devolver true si hay usuario en sesion y es el dueño del seguimiento
    return this.usuarioSesion?.idUsuario === seguimiento.usuario.idUsuario;
  }


}

