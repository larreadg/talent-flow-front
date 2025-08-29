import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  private http = inject(HttpClient)

  getCiudades() {
    return this.http.get<Array<{ departamento_ciudad: string, ciudad: string, departamento: string }>>('assets/json/ciudades.json')
  }

}
