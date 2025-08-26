import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TalentFlowResponse } from '../interfaces/talentflow.interface';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private http = inject(HttpClient)

  get() {
    return this.http.get<TalentFlowResponse>(`${environment.apiUrl}/usuarios/mi-empresa`);
  }
}
