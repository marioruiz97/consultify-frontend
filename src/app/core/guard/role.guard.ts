import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { RoleService } from "../service/role.service";
import { UIService } from "../service/ui.service";
import { Rol } from "../model/usuario-sesion.model";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {

  constructor(private roleService: RoleService, private router: Router, private uiService: UIService) { }

  /**
   * Usar este guard para proteger el acceso a informacion y restringirlo a usuarios de asisge
   * @returns devuelve si puede o no acceder a la informacion dependiendo de su rol
   */
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const role = this.roleService.getRole();

    if (role == Rol.ROLE_ADMIN || role == Rol.ROLE_ASESOR) {
      return true;
    }

    this.uiService.mostrarAlerta('No tienes acceso a este recurso');
    this.router.navigate(['/home']);
    return false;
  }


}
