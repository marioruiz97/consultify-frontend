import { Injectable } from '@angular/core';
import { AuthRequest } from '../model/auth-request.model';
import { Rol, UsuarioSesion } from '../model/usuario-sesion.model';

export interface UsuarioQuemado {
  authRequest: AuthRequest,
  infoUsuario: UsuarioSesion
}

@Injectable({
  providedIn: 'root'
})
export class MockHttpService {

  private usuariosQuemados: UsuarioQuemado[] = [
    { authRequest: { nombreUsuario: 'admin1', contrasena: 'contra1234' }, infoUsuario: { idUsuario: 1, identificacion: '1017251545', nombreUsuario: 'admin1', nombreCompleto: 'Mario Ruiz', rol: Rol.ADMIN, correo: 'marioRuiz@gmail.com' } },
    { authRequest: { nombreUsuario: 'cliente1@gmail.com', contrasena: 'contra1234' }, infoUsuario: { idUsuario: 2, identificacion: '1017214122', nombreUsuario: 'cliente1', nombreCompleto: 'carlos ramses', rol: Rol.ASESOR, correo: 'cliente1@gmail.com' } },
    { authRequest: { nombreUsuario: 'asesor1', contrasena: 'contra1234' }, infoUsuario: { idUsuario: 3, identificacion: '1017223908', nombreUsuario: 'asesor1', nombreCompleto: 'Juan Patino', rol: Rol.CLIENTE, correo: 'juanPatino@gmail.com' } }
  ];



  loginRequest(authRequest: AuthRequest): UsuarioSesion {
    const usuario: UsuarioSesion = this.usuariosQuemados.filter(usuario => usuario.authRequest.nombreUsuario === authRequest.nombreUsuario
      && usuario.authRequest.contrasena === authRequest.contrasena).map(usuarioQuemado => usuarioQuemado.infoUsuario)[0];
    return usuario;
  }

}
