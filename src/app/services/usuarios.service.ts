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
    return this.http.get<TalentFlowResponse>(`${environment.apiUrl}/usuarios`)
  }
  
  post(data: any) {
    return this.http.post<TalentFlowResponse>(`${environment.apiUrl}/usuarios`, data)
  }
  
  patch(data: any) {
    return this.http.patch<TalentFlowResponse>(`${environment.apiUrl}/usuarios/${data.id}`, data)
  }

  getRoles() {
    return this.http.get<TalentFlowResponse>(`${environment.apiUrl}/roles`)
  }
}
