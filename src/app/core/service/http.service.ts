import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, provideHttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { AuthRequest } from '../model/auth-request.model';
import { AppConstants } from 'src/app/shared/app.constants';

export interface Options {
  headers?: HttpHeaders;
}

@Injectable({ providedIn: 'root' })
export class HttpService {

  private API_ENDPOINT = "http://localhost:8080";
  private LOGIN_PATH = `auth/${AppConstants.RUTA_LOGIN}`;

  constructor(protected httpClient: HttpClient) { }

  public createDefaultOptions(): Options {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  }

  loginRequest(authRequest: AuthRequest): Promise<any> {
    return lastValueFrom(this.httpClient.post(`${this.API_ENDPOINT}/${this.LOGIN_PATH}`, authRequest, this.createDefaultOptions()))
  }


  postRequest<T, R>(path: string, data: T): Promise<R> {
    return lastValueFrom(this.httpClient
      .post<R>(
        `${this.API_ENDPOINT}/${path}`,
        data,
        this.createDefaultOptions()
      ));
  }

  putRequest<T, R>(path: string, data: T): Promise<R> {
    return lastValueFrom(this.httpClient
      .put<R>(
        `${this.API_ENDPOINT}/${path}`,
        data,
        this.createDefaultOptions()
      ))
  }

  getRequest<T>(path: string): Observable<T> {
    return this.httpClient.get<T>(
      `${this.API_ENDPOINT}/${path}`,
      this.createDefaultOptions()
    );
  }

  deleteRequest<R>(path: string): Promise<R> {
    return lastValueFrom(this.httpClient
      .delete<R>(`${this.API_ENDPOINT}/${path}`))
  }
}
