import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { HomeComponent } from './feature/home/home.component';
import { InicioSesionComponent } from './feature/autenticacion/components/inicio-sesion/inicio-sesion.component';
import { RecuperarContrasenaComponent } from './feature/autenticacion/components/recuperar-contrasena/recuperar-contrasena.component';
import { MiPerfilComponent } from './feature/autenticacion/components/mi-perfil/mi-perfil.component';
import { ListaUsuariosComponent } from './feature/usuarios/components/lista-usuarios/lista-usuarios.component';
import { FormularioUsuarioComponent } from './feature/usuarios/components/formulario-usuario/formulario-usuario.component';
import { AppConstants as rutas } from './shared/app.constants';
import { AuthGuard } from './core/guard/auth.guard';
import { AcercaDeComponent } from './feature/acerca-de/acerca-de.component';
import { ContactenosComponent } from './feature/contactenos/contactenos.component';
import { ListaClientesComponent } from './feature/clientes/components/lista-clientes/lista-clientes.component';
import { FormularioClienteComponent } from './feature/clientes/components/formulario-cliente/formulario-cliente.component';
import { ListaProyectosComponent } from './feature/proyectos/components/lista-proyectos/lista-proyectos.component';
import { TableroProyectoComponent } from './feature/proyectos/components/tablero-proyecto/tablero-proyecto.component';

const routes: Routes = [
  // módulos generales
  { path: '', redirectTo: `/${rutas.RUTA_HOME}`, pathMatch: 'full' },
  { path: rutas.RUTA_HOME, component: HomeComponent, canActivate: mapToCanActivate([AuthGuard]) },
  { path: rutas.RUTA_ACERCA, component: AcercaDeComponent },
  { path: rutas.RUTA_CONTACTO, component: ContactenosComponent },

  // autenticacion y cuenta
  { path: rutas.RUTA_LOGIN, component: InicioSesionComponent },
  { path: rutas.RUTA_RECUPERAR, component: RecuperarContrasenaComponent },
  { path: rutas.RUTA_CUENTA, component: MiPerfilComponent },

  // usuarios y clientes
  { path: rutas.RUTA_USUARIOS, component: ListaUsuariosComponent },
  { path: `${rutas.RUTA_USUARIOS}/:id`, component: FormularioUsuarioComponent },
  { path: rutas.RUTA_CLIENTES, component: ListaClientesComponent },
  { path: `${rutas.RUTA_CLIENTES}/:id`, component: FormularioClienteComponent },

  // proyectos
  { path: rutas.RUTA_PROYECTOS, component: ListaProyectosComponent },
  { path: `${rutas.RUTA_PROYECTOS}/:id`, component: TableroProyectoComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
