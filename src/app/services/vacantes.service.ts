import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TalentFlowResponse } from '../interfaces/talentflow.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacantesService {

  private http = inject(HttpClient)

  get(limit?: number, offset?: number, filter?: string | null) {
    let params = new HttpParams()
    if(limit) params = params.append('limit', limit)
    if(offset) params = params.append('offset', offset)
    if(filter) params = params.append('filter', filter)
    return this.http.get<TalentFlowResponse>(`${environment.apiUrl}/vacantes`, { params })
  }

  post(data: any) {
    return this.http.post<TalentFlowResponse>(`${environment.apiUrl}/vacantes`, data)
  }
  
  patch(data: any) {
    return this.http.patch<TalentFlowResponse>(`${environment.apiUrl}/vacantes/${data.id}`, data)
  }
  
  delete(sedeId: string) {
    return this.http.delete<TalentFlowResponse>(`${environment.apiUrl}/vacantes/${sedeId}`)
  }
}
