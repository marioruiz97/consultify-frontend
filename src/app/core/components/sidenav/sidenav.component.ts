import { NavItem } from '../../model/nav-item';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent {

  @Output() closeSidenav = new EventEmitter();

  @Input() menu!: NavItem[];

  nombre = "Mario";

  constructor(private authService: AuthService) { }


  onToggle(): void {
    this.closeSidenav.emit();
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
  }
}
