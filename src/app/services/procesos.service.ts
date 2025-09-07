import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TalentFlowResponse } from '../interfaces/talentflow.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcesosService {

  private http = inject(HttpClient)

  get() {
    return this.http.get<TalentFlowResponse>(`${environment.apiUrl}/procesos`)
  }
  
  post(data: any) {
    return this.http.post<TalentFlowResponse>(`${environment.apiUrl}/procesos`, data)
  }
}
