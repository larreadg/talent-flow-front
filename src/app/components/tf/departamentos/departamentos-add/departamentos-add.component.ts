import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartamentosService } from '../../../../services/departamentos.service';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Primeng
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-departamentos-add',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './departamentos-add.component.html',
  styleUrl: './departamentos-add.component.scss'
})
export class DepartamentosAddComponent {
  private toast = inject(MessageService)
  private api = inject(DepartamentosService)
  private fb   = inject(FormBuilder)
  submitted = false
  env = environment
  @Output() changed = new EventEmitter<boolean>()
  form = this.fb.nonNullable.group({
    nombre: this.fb.nonNullable.control(
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

    const body = this.form.getRawValue()
    this.api.post(body).subscribe({
      next: async(resp) => {
        this.submitted = false
        this.toast.add({ key: 'departamentos', severity: 'success', summary: this.env.appName, detail: `Departamento ${body.nombre} fue agregado`, life: 6000 })
        this.form.reset()
        this.changed.emit(true)
      },
      error: (e) => {
        this.toast.add({ key: 'departamentos', severity: 'error', summary: this.env.appName, detail: 'Error al crear departamento' })
        this.submitted = false
      }
    })

  }

}
