import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/service/http.service';

@Injectable()
export class TipoActividadesService {

  constructor(private httpService: HttpService) { }
}
