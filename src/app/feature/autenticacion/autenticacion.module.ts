import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { AppRoutingModule } from 'src/app/app-routing.module';



@NgModule({
  declarations: [InicioSesionComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    AppRoutingModule
  ]
})
export class AutenticacionModule { }
