import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { passwordRulesValidator } from '../../../utils/utils';
import { environment } from '../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { TalentFlowResponse } from '../../../interfaces/talentflow.interface';

//Primeng
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-update-pass',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    PasswordModule,
    DividerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './update-pass.component.html',
  styleUrl: './update-pass.component.scss'
})
export class UpdatePassComponent {

  private toast = inject(MessageService)
  private api = inject(UsuariosService)
  private fb   = inject(FormBuilder)
  submitted = false
  env = environment
  @Output() changed = new EventEmitter<boolean>()
  form = this.fb.nonNullable.group({
    pass: this.fb.nonNullable.control(
      '',
      [Validators.required, passwordRulesValidator]
    ),
    repeatPass: this.fb.nonNullable.control(
      '',
      [Validators.required, passwordRulesValidator]
    ),
  });

  // Regex para el indicador de fuerza y para checks en la lista
  strongRegex = String.raw`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$`
  lowerRe    = /[a-z]/;
  upperRe    = /[A-Z]/;
  digitRe    = /\d/;
  symbolRe   = /[^\w\s]/;

  submit() {
    this.submitted = true
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const body = this.form.getRawValue()
    this.api.updatePass(body).subscribe({
      next: async(resp) => {
        this.submitted = false
        this.toast.add({ key: 'nav', severity: 'success', summary: this.env.appName, detail: `Tu contraseña fue actualizada`, life: 6000 })
        this.form.reset()
        this.changed.emit(true)
      },
      error: (e: HttpErrorResponse) => {
        const error: TalentFlowResponse = e.error
        this.toast.add({ key: 'nav', severity: 'error', summary: this.env.appName, detail:  error.message || 'Error al cambiar contraseña'})
        this.submitted = false
      }
    })


  }

  get f() { return this.form.controls }
}
