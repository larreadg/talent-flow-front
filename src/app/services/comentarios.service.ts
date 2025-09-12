import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TalentFlowResponse } from '../interfaces/talentflow.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {

  private http = inject(HttpClient)

  get(id:string) {
    return this.http.get<TalentFlowResponse>(`${environment.apiUrl}/comentarios/${id}`)
  }
  
  delete(id:string) {
    return this.http.delete<TalentFlowResponse>(`${environment.apiUrl}/comentarios/${id}`)
  }
  
  post(data: any) {
    return this.http.post<TalentFlowResponse>(`${environment.apiUrl}/comentarios/${data.id}`, data)
  }
  
  put(data: any) {
    return this.http.put<TalentFlowResponse>(`${environment.apiUrl}/comentarios/${data.id}`, data)
  }
}
