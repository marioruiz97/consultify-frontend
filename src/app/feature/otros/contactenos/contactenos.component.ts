import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/core/service/ui.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { InformacionNegocio, EquipoDeContacto } from './model/contactenos.model';
import { AppConstants } from 'src/app/shared/app.constants';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ],
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactenosComponent implements OnDestroy {

  private subs: Subscription[] = [];
  contactForm: FormGroup;

  empresa: InformacionNegocio[] = [
    { icon: 'phonelink_ring', title: 'Teléfono: 448 61 02', value: 'Consulta Gratis' },
    { icon: 'location_on', title: 'Dirección: Calle 51 # 84 - 181 int. 114', value: 'Barrio Calazans' }
  ];

  equipo: EquipoDeContacto[] = [
    {
      nombre: 'JUAN ERASMO LAVERDE', cargo: 'GERENTE',
      telefono: '313 748 20 30', email: 'gerencia@asisge.com'
    },
    {
      nombre: 'OSCAR LAVERDE', cargo: 'ASISTENTE ADMINISTRATIVO',
      telefono: '318 502 66 41', email: 'administrativo@asisge.com'
    },
    {
      nombre: 'MATEO MORALES', cargo: 'SOPORTE TÉCNICO',
      telefono: '311 300 00 51', email: 'soporteasisge@gmail.com'
    },
  ];


  constructor(
    private uiService: UIService, private httpClient: HttpClient
  ) {
    this.contactForm = this.initForm();
  }


  initForm(): FormGroup {
    return new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(10), Validators.pattern(AppConstants.PATRON_TELEFONO)]),
      mensaje: new FormControl('', [Validators.required, Validators.maxLength(255)])
    });
  }

  onSubmit(): void {
    this.sendEmail();
  }

  private sendEmail() {
    const data = this.contactForm.value;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    this.subs.push(
      this.httpClient.post('https://us-central1-proyectos-asisge.cloudfunctions.net/sendEmail', data, httpOptions)
        .subscribe({
          next: (res: any) => {
            this.uiService.mostrarSnackBar(res.success, 3);
            this.contactForm = this.initForm();
          },
          error: (error) => {
            console.log('error', error);
            this.uiService.mostrarError(error);
          }
        })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
