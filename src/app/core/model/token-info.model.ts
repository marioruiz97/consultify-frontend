export class TokenInfo {
  usuario: string;
  jwt: string;

  constructor(usuario: string, jwt: string) {
    this.usuario = usuario;
    this.jwt = jwt;
  }
}
