import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

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
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { KvStoreService } from '../../services/kv-store.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    DividerModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    ToastModule,
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

  form = this.fb.nonNullable.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false],
  });

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
      error: (e) => {
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: 'Usuario y/o contraseña incorrecta' });
        this.loading = false
      }
    });
  }
}
