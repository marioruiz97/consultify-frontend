import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature/home/home.component';
import { InicioSesionComponent } from './feature/autenticacion/components/inicio-sesion/inicio-sesion.component';
import { RecuperarContrasenaComponent } from './feature/autenticacion/components/recuperar-contrasena/recuperar-contrasena.component';
import { MiPerfilComponent } from './feature/autenticacion/components/mi-perfil/mi-perfil.component';
import { ListaUsuariosComponent } from './feature/usuarios/components/lista-usuarios/lista-usuarios.component';
import { FormularioUsuarioComponent } from './feature/usuarios/components/formulario-usuario/formulario-usuario.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: InicioSesionComponent },
  { path: 'recuperar', component: RecuperarContrasenaComponent },
  { path: 'cuenta', component: MiPerfilComponent },
  { path: 'usuarios', component: ListaUsuariosComponent },
  { path: 'usuarios/:id', component: FormularioUsuarioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
