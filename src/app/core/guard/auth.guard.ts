import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../service/auth.service";
import { AppConstants as rutas } from "src/app/shared/app.constants";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.estaAutenticado.getValue()) {
      if (this.haExpiradoToken()) {
        this.authService.sesionExpirada(null);
        return false;
      }
      return true;
    }
    this.router.navigate([rutas.RUTA_LOGIN]);
    return false;
  }

  private haExpiradoToken(): boolean {
    const token = this.authService.obtenerToken();
    if (!token) return true;
    const payload = token.jwt ? JSON.parse(atob(token.jwt.split('.')[1])) : null;
    const now = new Date().getTime() / 1000;
    return payload === null || payload.exp < now ? true : false;
  }

}
