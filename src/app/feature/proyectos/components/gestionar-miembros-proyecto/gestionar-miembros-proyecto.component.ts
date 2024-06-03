import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MiembroProyecto } from '../../model/miembros/miembro-proyecto.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription, map, of, startWith } from 'rxjs';
import { TableroProyectoService } from '../../service/tablero-proyecto.service';
import { UIService } from 'src/app/core/service/ui.service';
import { ConfirmDialogData } from 'src/app/core/model/confirm-dialog-data.model';

@Component({
  selector: 'app-gestionar-miembros-proyecto',
  templateUrl: './gestionar-miembros-proyecto.component.html',
  styleUrls: ['./gestionar-miembros-proyecto.component.css']
})
export class GestionarMiembrosProyectoComponent implements OnInit, OnDestroy {

  miembroForm: FormGroup;
  miembros: MiembroProyecto[] = [];
  noHayPosiblesMiembros = false;

  private usuarios: MiembroProyecto[] = [];
  filteredUsuarios: Observable<MiembroProyecto[]> = of(this.usuarios);

  private subs: Subscription[] = [];

  mostrarUsuarioFn = (miembro: MiembroProyecto) => {
    return miembro?.usuario ? `${miembro.usuario.nombres} ${miembro.usuario.apellidos} - ${miembro.usuario.correo}` : '';
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MiembroProyecto[],
    private tableroService: TableroProyectoService,
    private uiService: UIService,
    private dialogRef: MatDialogRef<GestionarMiembrosProyectoComponent>
  ) {
    if (data && data.length > 0) this.miembros = data;
    this.miembroForm = this.iniciarFormulario();
    this.obtenerPosiblesMiembros();
  }

  ngOnInit(): void {
    const usuarioFormControl = this.miembroForm.get('usuario');
    if (usuarioFormControl) {
      this.filteredUsuarios = usuarioFormControl.valueChanges.pipe(
        startWith(''),
        map(input => typeof input === 'string' ? input : input.usuario.correo),
        map(value => value ? this._filter(value) : this.usuarios.slice())
      );
    }
  }

  private iniciarFormulario(): FormGroup {
    return new FormGroup({ usuario: new FormControl('', Validators.required) });
  }

  private _filter(value: string): MiembroProyecto[] {
    const filterValue = value.trim().toLowerCase();

    return this.usuarios.filter(user =>
      user.usuario.nombres.toLowerCase().includes(filterValue) ||
      user.usuario.apellidos.toLocaleLowerCase().includes(filterValue) ||
      user.usuario.correo.toLowerCase().includes(filterValue)
    ).slice();
  }

  obtenerPosiblesMiembros() {
    this.subs.push(
      this.tableroService.obtenerPosiblesMiembros().subscribe(usuarios => {
        this.usuarios = usuarios;
        this.noHayPosiblesMiembros = usuarios.length < 1;
      })
    );
  }


  getMiembroName(miembro: MiembroProyecto): string {
    const user = miembro.usuario;
    return `${user.nombres} ${user.apellidos}`;
  }

  eliminarMiembro(miembro: MiembroProyecto) {
    const data: ConfirmDialogData = {
      title: 'Quitar Miembro',
      message: '¿Estás seguro de quitar un miembro?',
      errors: [],
      showCancel: true,
      confirm: 'Sí, deseo quitarlo'
    };

    this.subs.push(
      this.uiService.mostrarConfirmDialog(data).afterClosed().subscribe(respuesta => {
        if (respuesta) this.tableroService.quitarMiembro(miembro)
          .then(nuevaLista => {
            if (nuevaLista) this.miembros = nuevaLista;
            this.obtenerPosiblesMiembros();
          })
      })
    );
  }

  cerrarModal() {
    this.dialogRef.close();
  }

  agregarMiembro() {
    this.tableroService.agregarMiembro(this.miembroForm.value)
      .then(() => {
        this.obtenerPosiblesMiembros();
        this.miembroForm.controls['usuario'].reset('');
        this.miembroForm.controls['usuario'].setErrors(null);
      });
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
