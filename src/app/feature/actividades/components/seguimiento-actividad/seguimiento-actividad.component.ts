import { Component, Input, OnInit } from '@angular/core';
import { Actividad } from '../../model/actividad.model';
import { FormControl, Validators } from '@angular/forms';
import { GestorActividadesService } from '../../service/gestor-actividades.service';
import { Persona, SeguimientoActividad } from '../../model/seguimiento-actividad.model';
import { UIService } from 'src/app/core/service/ui.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { UsuarioSesion } from 'src/app/core/model/usuario-sesion.model';

@Component({
  selector: 'app-seguimiento-actividad',
  templateUrl: './seguimiento-actividad.component.html',
  styleUrls: ['./seguimiento-actividad.component.css']
})
export class SeguimientoActividadComponent implements OnInit {

  private miUsuario: UsuarioSesion | null;
  @Input() actividad!: Actividad;

  comentarios = new FormControl('', [Validators.required, Validators.maxLength(255)]);
  seguimientos: SeguimientoActividad[] = [];

  constructor(
    private actividadService: GestorActividadesService,
    private authService: AuthService,
    private uiService: UIService
  ) {
    this.miUsuario = this.authService.obtenerUsuarioSesion();
  }

  ngOnInit(): void {
    this.actividadService.obtenerSeguimientoActividad(this.actividad.id).subscribe(lista => this.seguimientos = lista);
  }

  nombreCompleto(usuario: Persona): string {
    return usuario.nombreCompleto ? usuario.nombreCompleto : usuario.nombres + ' ' + usuario.apellidos;
  }

  agregarSeguimiento() {
    if (this.comentarios.value && this.comentarios.value !== '') {
      this.actividadService.agregarSeguimientoActividad(this.comentarios.value, this.actividad)
        .then(seguimiento => {
          if (this.miUsuario) seguimiento.usuario = { nombres: '', apellidos: '', nombreCompleto: this.miUsuario.nombreCompleto };
          this.uiService.mostrarSnackBar('Seguimiento agregado con exito', 0.5, '');
          this.seguimientos.push(seguimiento);
          this.comentarios.reset('');
          this.comentarios.setErrors(null);
        })
        .catch(err => this.uiService.mostrarError(err));
    }
  }
}
