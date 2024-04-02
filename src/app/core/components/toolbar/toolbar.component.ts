import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavItem } from '../../model/nav-item';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {

  @Input() menu!: NavItem[];

  ajustes: NavItem[] = [
    { name: 'Mi cuenta', url: '/cuenta', icon: 'account_circle' },
    { name: 'Acerca de', url: '/acerca', icon: 'account_tree' },
    /* { name: 'Contacto', url: '/contacto', icon: 'contacts' } */
  ];

  @Output() openMenu = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }
}
