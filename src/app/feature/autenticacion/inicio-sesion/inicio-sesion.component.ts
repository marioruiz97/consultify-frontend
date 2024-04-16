import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faFacebookF, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { AuthRequest } from 'src/app/core/model/auth-request.model';
import { AuthService } from 'src/app/core/service/auth.service';
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
    { nombre: "Twitter", faIcon: faXTwitter, url: "https://twitter.com/asisgesa", target: "_blank" },
    { nombre: "Instagram", faIcon: faInstagram, url: "https://www.instagram.com/asisges.a.s", target: "_blank" },
  ]

  loginForm: FormGroup;
  hide: boolean = true;

  constructor(private authService: AuthService) {
    this.loginForm = new FormGroup({
      nombreUsuario: new FormControl('', [Validators.required, Validators.maxLength(64), Validators.minLength(4)]),
      contrasena: new FormControl('', [Validators.required, Validators.maxLength(14), Validators.minLength(8)]),
    })
  }

  iniciarSesion() {
    const authRequest: AuthRequest = this.loginForm.value as AuthRequest;
    console.log("iniciando sesion", authRequest)
    this.authService.iniciarSesion(authRequest);
  }

}