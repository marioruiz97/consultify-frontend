import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faFacebookF, faXTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from 'src/app/core/service/auth.service';
import { EnlaceExterno } from 'src/app/shared/model/enlace-externo.model';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['../inicio-sesion/inicio-sesion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecuperarContrasenaComponent {

  resetForm: FormGroup;

  redes: EnlaceExterno[] = [
    { nombre: "Facebook", faIcon: faFacebookF, url: "https://www.facebook.com/ASISGE", target: "_blank" },
    { nombre: "Twitter", faIcon: faXTwitter, url: "https://twitter.com/asisgesa", target: "_blank" },
    { nombre: "Instagram", faIcon: faInstagram, url: "https://www.instagram.com/asisges.a.s", target: "_blank" },
  ]

  constructor(private authService: AuthService) {
    this.resetForm = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.maxLength(64), Validators.minLength(6), Validators.email]),
    });
  }

  recuperarContrasena() {
    this.authService.recuperarContrasena();
  }


}
