import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DiaNoLaboral } from '../../../../interfaces/dia-no-laboral.interface';
import { DiaNoLaboralService } from '../../../../services/dia-no-laboral.service';
import { environment } from '../../../../../environments/environment';

// Primeng
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { tiposDnl } from '../../../../utils/utils';
import { HttpErrorResponse } from '@angular/common/http';
import { TalentFlowResponse } from '../../../../interfaces/talentflow.interface';
import dayjs from 'dayjs';

@Component({
  selector: 'app-dia-no-laboral-edit',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    RadioButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dia-no-laboral-edit.component.html',
  styleUrl: './dia-no-laboral-edit.component.scss'
})
export class DiaNoLaboralEditComponent {
  @Input() set departamento(dnl:DiaNoLaboral | undefined) {
    if(dnl) {
      this.setInfo(dnl)
    }
  }

  private toast = inject(MessageService)
  private api = inject(DiaNoLaboralService)
  private fb   = inject(FormBuilder)
  submitted = false
  env = environment
  tiposDnl = tiposDnl
  @Output() changed = new EventEmitter<boolean>()
  form = this.fb.nonNullable.group({
    id: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
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

  setInfo(dnl: DiaNoLaboral) {
    this.form.controls['tipo'].setValue(dnl.tipo)
    this.form.controls['fecha'].setValue(dnl.fecha)
    this.form.controls['nombre'].setValue(dnl.nombre)
    this.form.controls['id'].setValue(dnl.id)
  }

  submit() {
    this.submitted = true
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    let body = this.form.getRawValue()
    body.fecha = dayjs(body.fecha).format('YYYY-MM-DD')
    this.api.patch(body).subscribe({
      next: async(resp) => {
        this.submitted = false
        this.toast.add({ key: 'sedes', severity: 'success', summary: this.env.appName, detail: `Departamento ${body.nombre} fue actualizado`, life: 6000 })
        this.form.reset()
        this.changed.emit(true)
      },
      error: (e: HttpErrorResponse) => {
        const error: TalentFlowResponse = e.error
        this.toast.add({ key: 'dnl', severity: 'error', summary: this.env.appName, detail: error.message || 'Error al editar día no laboral' })
        this.submitted = false
      }
    })
  }
  
}
