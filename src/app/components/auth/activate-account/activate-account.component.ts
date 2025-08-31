import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { passwordRulesValidator } from '../../../utils/utils';
import { CommonModule } from '@angular/common';

// Primeng
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

// Reactive Forms
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Services
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { TalentFlowResponse } from '../../../interfaces/talentflow.interface';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    DividerModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    ToastModule,
    PasswordModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent implements OnInit {
  env = environment
  captchaUrl = `${this.env.apiUrl}/auth/captcha?${new Date().getTime()}`
  loading: boolean = false
  token: string = ''
  // Regex para el indicador de fuerza y para checks en la lista
  strongRegex = String.raw`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$`
  lowerRe    = /[a-z]/;
  upperRe    = /[A-Z]/;
  digitRe    = /\d/;
  symbolRe   = /[^\w\s]/;

  private auth = inject(AuthService)
  private toast = inject(MessageService)
  private fb   = inject(FormBuilder)
  private router = inject(Router)
  private route = inject(ActivatedRoute);

  form = this.fb.nonNullable.group({
    pass: this.fb.nonNullable.control(
      '',
      [Validators.required, passwordRulesValidator]
    ),
    repeatPass: this.fb.nonNullable.control(
      '',
      [Validators.required, passwordRulesValidator]
    ),
    token: this.fb.nonNullable.control(
      '',[Validators.required]
    ),
    captcha: this.fb.nonNullable.control(
      '',[Validators.required]
    ),
  });

  async ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? ''
    if(this.token === '') this.router.navigate(['/auth/login'])
    this.form.controls['token'].setValue(this.token)
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true
    const body = this.form.getRawValue()
    this.auth.activateAccount(body).subscribe({
      next: async(resp) => {
        this.toast.add({ severity: 'success', summary: this.env.appName, detail: 'Tu cuenta fue activada' });
        setTimeout(() => {
          this.router.navigate(['/auth/login'])
        }, 3000)
      },
      error: (e: HttpErrorResponse) => {
        this.captchaUrl = `${this.env.apiUrl}/auth/captcha?${new Date().getTime()}`
        const error: TalentFlowResponse = e.error
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: error.message || 'Error al activar cuenta' });
        this.loading = false
      }
    });
  }

  get f() { return this.form.controls }
}
