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
  
  activateAccount(dto: { pass: string; repeatPass: string, token: string, captcha: string }) {
    return this.http.post<TalentFlowResponse>(`${environment.apiUrl}/auth/activate-account`, dto);
  }
  
  resetAccountReset(dto: { email: string, captcha: string }) {
    return this.http.post<TalentFlowResponse>(`${environment.apiUrl}/auth/reset-account/request`, dto);
  }
  
  resetAccount(dto: { pass: string; repeatPass: string, token: string, captcha: string }) {
    return this.http.post<TalentFlowResponse>(`${environment.apiUrl}/auth/reset-account`, dto);
  }
}
