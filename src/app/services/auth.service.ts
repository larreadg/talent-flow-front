import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TalentFlowResponse } from '../interfaces/talentflow.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  login(dto: { email: string; password: string }) {
    return this.http.post<TalentFlowResponse>(`${environment.apiUrl}/auth/login`, dto);
  }
}
