import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Departamento } from '../../../../interfaces/departamento.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartamentosService } from '../../../../services/departamentos.service';
import { environment } from '../../../../../environments/environment';

// Primeng
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-departamentos-edit',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './departamentos-edit.component.html',
  styleUrl: './departamentos-edit.component.scss'
})
export class DepartamentosEditComponent {
  @Input() set departamento(dep:Departamento | undefined) {
    if(dep) {
      this.setInfo(dep)
    }
  }

  private toast = inject(MessageService)
  private api = inject(DepartamentosService)
  private fb   = inject(FormBuilder)
  submitted = false
  env = environment
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
  });

  get f() { return this.form.controls }
  
  setInfo(dep: Departamento) {
    this.form.controls['nombre'].setValue(dep.nombre)
    this.form.controls['id'].setValue(dep.id)
  }

  submit() {
    this.submitted = true
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const body = this.form.getRawValue()
    this.api.patch(body).subscribe({
      next: async(resp) => {
        this.submitted = false
        this.toast.add({ key: 'sedes', severity: 'success', summary: this.env.appName, detail: `Departamento ${body.nombre} fue actualizado`, life: 6000 })
        this.form.reset()
        this.changed.emit(true)
      },
      error: (e) => {
        this.toast.add({ key: 'sedes', severity: 'error', summary: this.env.appName, detail: 'Error al actualizar departamento' })
        this.submitted = false
      }
    })

  }
}
