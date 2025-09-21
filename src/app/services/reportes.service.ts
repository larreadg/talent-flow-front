import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TalentFlowResponse } from '../interfaces/talentflow.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private http = inject(HttpClient)

  get(params: {
    estados?: string[];
    departamentos?: string[];
    sedes?: string[];
    id?: string;
    token: string
  }) {
    const qs = new URLSearchParams();
    if (params.estados?.length) qs.set('estados', params.estados.join(','));
    if (params.departamentos?.length) qs.set('departamentos', params.departamentos.join(','));
    if (params.sedes?.length) qs.set('sedes', params.sedes.join(','));
    if (params.id) qs.set('id', params.id);
    return this.http.get(`${environment.apiUrl}/reportes?${qs.toString()}`, { responseType: 'blob', observe: 'response', headers: { Authorization: `Bearer ${params.token}` } });
  }

  getSLAResumenMaximo() {
    return this.http.get<TalentFlowResponse>(`${environment.apiUrl}/reportes/cumplimiento-sla-maximo`)
  }
  
  getTopIncumplimiento(limit: number) {
    return this.http.get<TalentFlowResponse>(`${environment.apiUrl}/reportes/top-incumplimiento/${limit}`)
  }
  
  getResumenVacantesUltimos12Meses() {
    return this.http.get<TalentFlowResponse>(`${environment.apiUrl}/reportes/vacantes-ultimo-anho`)
  }
}
