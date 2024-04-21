import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavItem } from '../../model/nav-item';
import { AppConstants as rutas } from 'src/app/shared/app.constants';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent {

  @Input() menu!: NavItem[];
  rutaHome = rutas.RUTA_HOME;

  ajustes: NavItem[] = [
    { name: 'Mi cuenta', url: rutas.RUTA_CUENTA, icon: 'account_circle' },
    { name: 'Acerca de', url: rutas.RUTA_ACERCA, icon: 'account_tree' },
    { name: 'Contacto', url: rutas.RUTA_CONTACTO, icon: 'contacts' }
  ];

  @Output() openMenu = new EventEmitter();

  constructor(private authService: AuthService) { }

  cerrarSesion() {
    this.authService.cerrarSesion();
  }

}
