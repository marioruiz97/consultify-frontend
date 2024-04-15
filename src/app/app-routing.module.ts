import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature/home/home.component';
import { InicioSesionComponent } from './feature/autenticacion/inicio-sesion/inicio-sesion.component';
import { RecuperarContrasenaComponent } from './feature/autenticacion/recuperar-contrasena/recuperar-contrasena.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: InicioSesionComponent },
  { path: 'recuperar', component: RecuperarContrasenaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
