import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Primeng
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { EtapasService } from '../../../../../services/etapas.service';
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-etapas-add',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './etapas-add.component.html',
  styleUrl: './etapas-add.component.scss'
})
export class EtapasAddComponent {
  private toast = inject(MessageService)
  private api = inject(EtapasService)
  private fb   = inject(FormBuilder)
  submitted = false
  env = environment
  @Output() changed = new EventEmitter<boolean>()
  form = this.fb.nonNullable.group({
    nombre: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
    slaDias: this.fb.nonNullable.control(
      1,
      [Validators.required, Validators.min(1)]
    ),
  });

  get f() { return this.form.controls }

  submit() {
    this.submitted = true
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const body = this.form.getRawValue()
    this.api.post(body).subscribe({
      next: async(resp) => {
        this.submitted = false
        this.toast.add({ key: 'etapas', severity: 'success', summary: this.env.appName, detail: `Etapa ${body.nombre} fue agregada`, life: 6000 })
        this.form.reset()
        this.changed.emit(true)
      },
      error: (e) => {
        this.toast.add({ key: 'etapas', severity: 'error', summary: this.env.appName, detail: 'Error al crear etapa' })
        this.submitted = false
      }
    })

  }

}
