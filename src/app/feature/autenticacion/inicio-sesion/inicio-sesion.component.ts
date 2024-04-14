import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faFacebookF, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { EnlaceExterno } from 'src/app/shared/model/enlace-externo.model';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioSesionComponent {

  redes: EnlaceExterno[] = [
    { nombre: "Facebook", faIcon: faFacebookF, url: "https://facebook.com", target: "_blank" },
    { nombre: "Twitter", faIcon: faXTwitter, url: "https://twitter.com", target: "_blank" },
    { nombre: "Instagram", faIcon: faInstagram, url: "https://instagram.com", target: "_blank" },
  ]

  loginForm: FormGroup;
  hide: boolean = true;

  constructor() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.maxLength(64), Validators.minLength(4)]),
      contrasena: new FormControl('', [Validators.required, Validators.maxLength(14), Validators.minLength(8)]),
    })
  }

  iniciarSesion() {
    console.log("iniciando sesion", this.loginForm.getRawValue())
  }

}
