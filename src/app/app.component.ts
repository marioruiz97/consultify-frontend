import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { NavItem } from './core/model/nav-item';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './core/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  title = 'consultify-front';
  $isHandset: Observable<boolean>;
  enSesion: boolean = false;

  public menu: NavItem[] = [
    { url: '/tipo-citas', name: 'lorem', icon: 'next_week' },
    { url: '/veterinarios', name: 'ipsum', icon: 'assignment_ind' },
    { url: '/responsables', name: 'lorem', icon: 'people' },
    { url: '/citas', name: 'ipsum', icon: 'book_online' },
  ];


  constructor(
    private breakPointObserver: BreakpointObserver,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.$isHandset = this.breakPointObserver
      .observe([Breakpoints.Handset])
      .pipe(
        map((result) => result.matches),
        tap(() => this.changeDetectorRef.detectChanges())
      );
    this.authService.estaAutenticado.subscribe(estaAutenticado => this.enSesion = estaAutenticado);
    this.authService.verificarSesion();
  }
}
