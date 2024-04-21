import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature/home/home.component';
import { InicioSesionComponent } from './feature/autenticacion/components/inicio-sesion/inicio-sesion.component';
import { RecuperarContrasenaComponent } from './feature/autenticacion/components/recuperar-contrasena/recuperar-contrasena.component';
import { MiPerfilComponent } from './feature/autenticacion/components/mi-perfil/mi-perfil.component';
import { ListaUsuariosComponent } from './feature/usuarios/components/lista-usuarios/lista-usuarios.component';
import { FormularioUsuarioComponent } from './feature/usuarios/components/formulario-usuario/formulario-usuario.component';
import { AppConstants as rutas } from './shared/app.constants';

const routes: Routes = [
  { path: '', redirectTo: `/${rutas.RUTA_HOME}`, pathMatch: 'full' },
  { path: rutas.RUTA_HOME, component: HomeComponent },
  { path: rutas.RUTA_LOGIN, component: InicioSesionComponent },
  { path: rutas.RUTA_RECUPERAR, component: RecuperarContrasenaComponent },
  { path: rutas.RUTA_CUENTA, component: MiPerfilComponent },
  { path: rutas.RUTA_USUARIOS, component: ListaUsuariosComponent },
  { path: `${rutas.RUTA_USUARIOS}/:id`, component: FormularioUsuarioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
