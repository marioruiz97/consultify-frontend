import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { AuthRequest } from '../model/auth-request.model';
import { AppConstants } from 'src/app/shared/app.constants';
import { AuthResponse } from '../model/auth-response.model';

export interface Options {
  headers?: HttpHeaders;
}

@Injectable({ providedIn: 'root' })
export class HttpService {

  private API_ENDPOINT = AppConstants.API_ENDPOINT;
  private LOGIN_PATH = `auth/${AppConstants.RUTA_LOGIN}`;

  constructor(protected httpClient: HttpClient) { }

  public createDefaultOptions(): Options {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  }

  loginRequest(authRequest: AuthRequest): Promise<AuthResponse> {
    return lastValueFrom(this.httpClient.post<AuthResponse>(`${this.API_ENDPOINT}/${this.LOGIN_PATH}`, authRequest, this.createDefaultOptions()))
  }


  postRequest<T, R>(path: string, data: T): Promise<R> {
    return lastValueFrom(this.httpClient
      .post<R>(
        `${this.API_ENDPOINT}/${path}`,
        data,
        this.createDefaultOptions()
      ));
  }

  putRequest<T, R = T>(path: string, data: T): Promise<R> {
    return lastValueFrom(this.httpClient
      .put<R>(
        `${this.API_ENDPOINT}/${path}`,
        data,
        this.createDefaultOptions()
      ))
  }

  patchRequest<T, R = T>(path: string, data: T): Promise<R> {
    return lastValueFrom(this.httpClient
      .patch<R>(
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
