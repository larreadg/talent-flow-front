import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TalentFlowResponse } from '../interfaces/talentflow.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  private http = inject(HttpClient)

  get() {
    return this.http.get<TalentFlowResponse>(`${environment.apiUrl}/departamentos`)
  }
  
  post(data: any) {
    return this.http.post<TalentFlowResponse>(`${environment.apiUrl}/departamentos`, data)
  }
  
  patch(data: any) {
    return this.http.patch<TalentFlowResponse>(`${environment.apiUrl}/departamentos/${data.id}`, data)
  }
  
  delete(sedeId: string) {
    return this.http.delete<TalentFlowResponse>(`${environment.apiUrl}/departamentos/${sedeId}`)
  }
}
