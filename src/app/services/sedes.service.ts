import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TalentFlowResponse } from '../interfaces/talentflow.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SedesService {

  private http = inject(HttpClient)

  get() {
    return this.http.get<TalentFlowResponse>(`${environment.apiUrl}/sedes`)
  }
  
  post(data: any) {
    return this.http.post<TalentFlowResponse>(`${environment.apiUrl}/sedes`, data)
  }
  
  patch(data: any) {
    return this.http.patch<TalentFlowResponse>(`${environment.apiUrl}/sedes/${data.id}`, data)
  }
  
  delete(sedeId: string) {
    return this.http.delete<TalentFlowResponse>(`${environment.apiUrl}/sedes/${sedeId}`)
  }

}
