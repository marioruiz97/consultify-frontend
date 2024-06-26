import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faFacebookF, faXTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from 'src/app/core/service/auth.service';
import { AppConstants } from 'src/app/shared/app.constants';
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
    { nombre: "Instagram", faIcon: faInstagram, url: "https://www.instagram.com/asisges.a.s", target: "_blank" },
    { nombre: "Twitter", faIcon: faXTwitter, url: "https://twitter.com/asisgesa", target: "_blank" },
    { nombre: "LinkedIn", faIcon: faLinkedin, url: "https://www.linkedin.com/company/asisge/", target: "_blank" },
  ]

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.estaAutenticado.value) this.router.navigate([AppConstants.RUTA_HOME]);

    this.resetForm = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.maxLength(64), Validators.minLength(6), Validators.email]),
    });
  }

  recuperarContrasena() {
    this.authService.recuperarContrasena(this.resetForm.value.correo);
    this.router.navigate([AppConstants.RUTA_LOGIN]);
  }


}
