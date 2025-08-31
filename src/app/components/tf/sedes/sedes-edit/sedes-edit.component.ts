import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Sede } from '../../../../interfaces/sede.interface';
import { MessageService } from 'primeng/api';
import { SedesService } from '../../../../services/sedes.service';
import { LocalService } from '../../../../services/local.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';

// Primeng
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sedes-edit',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sedes-edit.component.html',
  styleUrl: './sedes-edit.component.scss'
})
export class SedesEditComponent implements OnInit {
  @Input() set sede(s:Sede | undefined) {
    if(s) {
      this.setInfo(s)
    }
  }
  private toast = inject(MessageService)
  private api = inject(SedesService)
  private apiLocal = inject(LocalService)
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
  })
  ciudades: any[] = []

  get f() { return this.form.controls }

  ngOnInit(): void {
    this.getCiudades()
  }

  setInfo(u: Sede) {
    this.form.controls['nombre'].setValue(u.nombre)
    this.form.controls['id'].setValue(u.id)
    this.form.controls['direccion'].setValue(u.direccion)
    this.form.controls['ciudad'].setValue(u.ciudad)
    this.form.controls['pais'].setValue(u.pais)
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
        this.toast.add({ key: 'sedes', severity: 'success', summary: this.env.appName, detail: `Sede actualizada`, life: 6000 })
        this.form.reset()
        this.changed.emit(true)
      },
      error: (e) => {
        this.toast.add({ key: 'sedes', severity: 'error', summary: this.env.appName, detail: 'Error al actualizar sede' })
        this.submitted = false
      }
    })

  }
}
