import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { NavItem } from './core/model/nav-item';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './core/service/auth.service';
import { MENU_NAVEGACION } from './shared/app.constants';
import { RoleService } from './core/service/role.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {

  title = 'consultify-front';
  $isHandset: Observable<boolean>;
  enSesion = false;
  private suscripciones: Subscription[] = [];

  public menu: NavItem[] = MENU_NAVEGACION.filter(opcion => this.rolService.rolRequerido(opcion.roles));


  constructor(
    private breakPointObserver: BreakpointObserver,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    private rolService: RoleService
  ) {
    this.$isHandset = this.breakPointObserver
      .observe([Breakpoints.Handset])
      .pipe(
        map((result) => result.matches),
        tap(() => this.changeDetectorRef.detectChanges())
      );

    this.suscripciones.push(
      this.authService.estaAutenticado.subscribe(estaAutenticado => {
        this.enSesion = estaAutenticado;
        this.menu = MENU_NAVEGACION.filter(opcion => this.rolService.rolRequerido(opcion.roles));
      })
    );

    this.authService.verificarSesion();
  }


  ngOnDestroy(): void {
    this.suscripciones.forEach(suscripcion => suscripcion.unsubscribe());
  }
}
