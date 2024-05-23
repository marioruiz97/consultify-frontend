import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faFacebookF, faInstagram, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { AuthRequest } from 'src/app/core/model/auth-request.model';
import { AuthService } from 'src/app/core/service/auth.service';
import { AppConstants } from 'src/app/shared/app.constants';
import { EnlaceExterno } from 'src/app/shared/model/enlace-externo.model';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioSesionComponent {

  redes: EnlaceExterno[] = [
    { nombre: "Facebook", faIcon: faFacebookF, url: "https://www.facebook.com/ASISGE", target: "_blank" },
    { nombre: "Instagram", faIcon: faInstagram, url: "https://www.instagram.com/asisges.a.s", target: "_blank" },
    { nombre: "Twitter", faIcon: faXTwitter, url: "https://twitter.com/asisgesa", target: "_blank" },
    { nombre: "LinkedIn", faIcon: faLinkedin, url: "https://www.linkedin.com/company/asisge/", target: "_blank" },
  ]

  loginForm: FormGroup;
  hide = true;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.estaAutenticado.value) this.router.navigate([AppConstants.RUTA_HOME]);

    this.loginForm = new FormGroup({
      nombreUsuario: new FormControl('', [Validators.required, Validators.maxLength(64), Validators.minLength(4)]),
      contrasena: new FormControl('', [Validators.required, Validators.maxLength(16), Validators.minLength(8), Validators.pattern(AppConstants.PATRON_CONTRASENA)]),
    })
  }

  iniciarSesion() {
    const authRequest: AuthRequest = this.loginForm.value as AuthRequest;
    this.authService.iniciarSesion(authRequest);
  }

}
