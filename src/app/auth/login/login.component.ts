import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

// Primeng
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

// Reactive Forms
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Services
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { KvStoreService } from '../../services/kv-store.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TalentFlowResponse } from '../../interfaces/talentflow.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    DividerModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    ReactiveFormsModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loading: boolean = false
  env = environment
  private auth = inject(AuthService)
  private fb   = inject(FormBuilder)
  private toast = inject(MessageService)
  private kv = inject(KvStoreService)
  private router = inject(Router)
  captchaUrl = `${this.env.apiUrl}/auth/captcha?${new Date().getTime()}`

  form = this.fb.nonNullable.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    captcha: ['', Validators.required],
    remember: [false],
  });

  // reset pass
  resetPassVisible: boolean = false
  resetPassForm = this.fb.nonNullable.group({
    email:    ['', [Validators.required, Validators.email]],
    captcha: ['', Validators.required],
  });
  resetPassLoading: boolean = false
  resetPassCaptchaUrl: string = ''

  async ngOnInit() {
    const userRemember = await this.kv.get('user_remember')
    const userEmail = await this.kv.get('user_email')
    if(userRemember && userEmail && userRemember === 'S') {
      this.form.controls['remember'].setValue(true)
      this.form.controls['email'].setValue(<string> userEmail)
    }
  }

  submit() {
    
    if (this.form.invalid) return;
    this.loading = true
    const body = this.form.getRawValue()
    this.auth.login(body).subscribe({
      next: async(resp) => {
        const data: any = resp.data
        await this.kv.set('user', JSON.stringify(data.user))
        await this.kv.set('token', data.token)
        if(body.remember) {
          await this.kv.set('user_remember', 'S')
          await this.kv.set('user_email', body.email)
        }
        this.loading = false
        this.router.navigate(['/tf/home'])
      },
      error: (e: HttpErrorResponse) => {
        this.captchaUrl = `${this.env.apiUrl}/auth/captcha?${new Date().getTime()}`
        const error: TalentFlowResponse = e.error
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: error.message || 'Usuario y/o contraseña incorrecta' });
        this.loading = false
      }
    });
  }

  resetPassOpen() {
    this.resetPassCaptchaUrl = `${this.env.apiUrl}/auth/captcha?${new Date().getTime()}`
    this.resetPassVisible = true
  }

  resetPassSubmit() {
    if (this.resetPassForm.invalid) return;
    this.resetPassLoading = true
    const body = this.resetPassForm.getRawValue()
    this.auth.resetAccountReset(body).subscribe({
      next: async() => {
        this.toast.add({ severity: 'success', summary: this.env.appName, detail: `Te enviamos un enlace a tu correo electrónico ${body.email} para restablecer tu cuenta` });
        this.resetPassLoading = false
        this.resetPassForm.reset()
        this.resetPassVisible = false
      },
      error: (e: HttpErrorResponse) => {
        this.resetPassCaptchaUrl = `${this.env.apiUrl}/auth/captcha?${new Date().getTime()}`
        const error: TalentFlowResponse = e.error
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: error.message || 'Error al restablecer cuenta' });
        this.resetPassLoading = false
      }
    });
  }
}
