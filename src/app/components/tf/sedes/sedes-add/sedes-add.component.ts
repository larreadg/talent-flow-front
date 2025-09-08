import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SedesService } from '../../../../services/sedes.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalService } from '../../../../services/local.service';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';

// Primeng
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-sedes-add',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sedes-add.component.html',
  styleUrl: './sedes-add.component.scss'
})
export class SedesAddComponent implements OnInit {
  private toast = inject(MessageService)
  private api = inject(SedesService)
  private apiLocal = inject(LocalService)
  private fb   = inject(FormBuilder)
  submitted = false
  env = environment
  @Output() changed = new EventEmitter<boolean>()
  form = this.fb.nonNullable.group({
    nombre: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
    direccion: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
    ciudad: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
    pais: this.fb.nonNullable.control(
      'PARAGUAY',
      [Validators.required]
    ),
  });
  ciudades: any[] = []

  get f() { return this.form.controls }

  ngOnInit(): void {
    this.getCiudades()
  }

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
        this.toast.add({ key: 'sedes', severity: 'success', summary: this.env.appName, detail: `Sede ${body.nombre} fue agregada`, life: 6000 })
        this.form.reset()
        this.changed.emit(true)
      },
      error: (e) => {
        this.toast.add({ key: 'sedes', severity: 'error', summary: this.env.appName, detail: 'Error al crear sede' })
        this.submitted = false
      }
    })

  }

  getCiudades = () => {
    this.apiLocal.getCiudades().subscribe({
      next: async(resp) => {
        this.ciudades = resp
      },
      error: (e) => {
        this.ciudades = []
      }
    })
  }
}
