import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TalentFlowResponse } from '../interfaces/talentflow.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacantesService {

  private http = inject(HttpClient)

  get(params: {
    limit: number; offset: number;
    filter?: string | null;
    sortBy?: string; sortDir?: 'asc' | 'desc';
    estados?: string[];
    departamentos?: string[];
    sedes?: string[];
  }) {
    const qs = new URLSearchParams();
    qs.set('limit',  String(params.limit));
    qs.set('offset', String(params.offset));
    if (params.filter) qs.set('filter', params.filter);
    if (params.sortBy) qs.set('sortBy', params.sortBy);
    if (params.sortDir) qs.set('sortDir', params.sortDir);
    if (params.estados?.length) qs.set('estados', params.estados.join(','));
    if (params.departamentos?.length) qs.set('departamentos', params.departamentos.join(','));
    if (params.sedes?.length) qs.set('sedes', params.sedes.join(','));
    return this.http.get(`${environment.apiUrl}/vacantes?${qs.toString()}`);
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

  getResumenPorEstado() {
    return this.http.get<TalentFlowResponse>(`${environment.apiUrl}/vacantes/estados`)
  }

  getById(id:string) {
    return this.http.get<TalentFlowResponse>(`${environment.apiUrl}/vacantes/${id}`)
  }

  completarEtapa(data: any) {
    return this.http.post<TalentFlowResponse>(`${environment.apiUrl}/vacantes/completar-etapa`, data)
  }
}
