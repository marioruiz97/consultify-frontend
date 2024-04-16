import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { CuentaService } from './service/cuenta.service';



@NgModule({
  declarations: [InicioSesionComponent, RecuperarContrasenaComponent, MiPerfilComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    AppRoutingModule
  ],
  providers: [
    CuentaService
  ]
})
export class AutenticacionModule { }
