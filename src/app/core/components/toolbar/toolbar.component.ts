import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavItem } from '../../model/nav-item';
import { AppConstants } from 'src/app/shared/app.constants';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent {

  @Input() menu!: NavItem[];
  rutaHome = AppConstants.RUTA_HOME;

  ajustes: NavItem[] = [
    { name: 'Mi cuenta', url: '/cuenta', icon: 'account_circle' },
    { name: 'Acerca de', url: '/acerca', icon: 'account_tree' },
    /* { name: 'Contacto', url: '/contacto', icon: 'contacts' } */
  ];

  @Output() openMenu = new EventEmitter();

  constructor() { }

}
