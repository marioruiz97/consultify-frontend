import { Injectable } from '@angular/core';
import { AuthRequest } from '../model/auth-request.model';
import { UsuarioSesion } from '../model/usuario-sesion.model';

export interface UsuarioQuemado {
  authRequest: AuthRequest,
  infoUsuario: UsuarioSesion
}

@Injectable({
  providedIn: 'root'
})
export class MockHttpService {

  private usuariosQuemados: UsuarioQuemado[] = [
    { authRequest: { nombreUsuario: 'admin1', contrasena: 'contra1234' }, infoUsuario: { idUsuario: 1, identificacion:'1017251545', nombreUsuario: 'admin1', nombre: 'Mario', apellido: 'Ruiz', correo: 'marioRuiz@gmail.com' } },
    { authRequest: { nombreUsuario: 'cliente1@gmail.com', contrasena: 'contra1234' }, infoUsuario: { idUsuario: 2, identificacion:'1017214122', nombreUsuario: 'cliente1', nombre: 'carlos', apellido: 'ramses', correo: 'cliente1@gmail.com' } },
    { authRequest: { nombreUsuario: 'asesor1', contrasena: 'contra1234' }, infoUsuario: { idUsuario: 3, identificacion:'1017223908', nombreUsuario: 'asesor1', nombre: 'Juan', apellido: 'Patino', correo: 'juanPatino@gmail.com' } }
  ];

  constructor() { }


  loginRequest(authRequest: AuthRequest): UsuarioSesion {
    const usuario: UsuarioSesion = this.usuariosQuemados.filter(usuario => usuario.authRequest.nombreUsuario === authRequest.nombreUsuario
      && usuario.authRequest.contrasena === authRequest.contrasena).map(usuarioQuemado => usuarioQuemado.infoUsuario)[0];
    return usuario;
  }

}
