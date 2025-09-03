import { inject, Injectable } from '@angular/core';
import { TalentFlowResponse } from '../interfaces/talentflow.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiaNoLaboralService {

  private http = inject(HttpClient)

  get() {
    return this.http.get<TalentFlowResponse>(`${environment.apiUrl}/dia-no-laboral`)
  }
  
  post(data: any) {
    return this.http.post<TalentFlowResponse>(`${environment.apiUrl}/dia-no-laboral`, data)
  }
  
  patch(data: any) {
    return this.http.patch<TalentFlowResponse>(`${environment.apiUrl}/dia-no-laboral/${data.id}`, data)
  }
  
  delete(diaNoLaboralId: string) {
    return this.http.delete<TalentFlowResponse>(`${environment.apiUrl}/dia-no-laboral/${diaNoLaboralId}`)
  }
}
