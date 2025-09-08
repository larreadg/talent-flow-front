import { Component, EventEmitter, inject, Output } from '@angular/core';
import { DiaNoLaboralService } from '../../../../services/dia-no-laboral.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { tiposDnl } from '../../../../utils/utils';
import dayjs from 'dayjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TalentFlowResponse } from '../../../../interfaces/talentflow.interface';

// Primeng
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-dia-no-laboral-add',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    RadioButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dia-no-laboral-add.component.html',
  styleUrl: './dia-no-laboral-add.component.scss'
})
export class DiaNoLaboralAddComponent {
  private toast = inject(MessageService)
  private api = inject(DiaNoLaboralService)
  private fb   = inject(FormBuilder)
  submitted = false
  env = environment
  tiposDnl = tiposDnl
  @Output() changed = new EventEmitter<boolean>()
  form = this.fb.nonNullable.group({
    nombre: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
    tipo: this.fb.nonNullable.control(
      'empresa',
      [Validators.required]
    ),
    fecha: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
  });

  get f() { return this.form.controls }
  
  submit() {
    this.submitted = true
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    let body = this.form.getRawValue()
    body.fecha = dayjs(body.fecha).format('YYYY-MM-DD')
    this.api.post(body).subscribe({
      next: async(resp) => {
        this.submitted = false
        this.toast.add({ key: 'dnl', severity: 'success', summary: this.env.appName, detail: `Día no laboral ${body.nombre} fue agregado`, life: 6000 })
        this.form.reset()
        this.changed.emit(true)
      },
      error: (e: HttpErrorResponse) => {
        const error: TalentFlowResponse = e.error
        this.toast.add({ key: 'dnl', severity: 'error', summary: this.env.appName, detail: error.message || 'Error al crear día no laboral' })
        this.submitted = false
      }
    })

  }
}
