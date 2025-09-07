import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../../../environments/environment';
import { ProcesosService } from '../../../../../services/procesos.service';
import { EtapasService } from '../../../../../services/etapas.service';
import { Etapa } from '../../../../../interfaces/etapa.interface';

// Primeng
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PickListModule } from 'primeng/picklist';

@Component({
  selector: 'app-procesos-add',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    PickListModule,
    ReactiveFormsModule,
  ],
  templateUrl: './procesos-add.component.html',
  styleUrl: './procesos-add.component.scss'
})
export class ProcesosAddComponent implements OnInit {
  private toast = inject(MessageService)
  private api = inject(ProcesosService)
  private fb   = inject(FormBuilder)
  private apiEtapas = inject(EtapasService)

  etapas: Etapa[] = []
  targetEtapas: Etapa[] = []

  submitted = false
  env = environment
  @Output() changed = new EventEmitter<boolean>()
  form = this.fb.nonNullable.group({
    nombre: this.fb.nonNullable.control('', [Validators.required]),
    descripcion: this.fb.control<string | null>(null),
    etapas: this.fb.nonNullable.control<Array<{ etapaId: string; orden: number }>>(
      [],
      [Validators.required, (c) => (c.value?.length > 0 ? null : { minLengthArray: true })]
    ),
  });

  ngOnInit(): void {
    this.getEtapas()
  }

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
        this.toast.add({ key: 'procesos', severity: 'success', summary: this.env.appName, detail: `Proceso ${body.nombre} fue agregada`, life: 6000 })
        this.form.reset()
        this.changed.emit(true)
      },
      error: (e) => {
        this.toast.add({ key: 'procesos', severity: 'error', summary: this.env.appName, detail: 'Error al crear proceso' })
        this.submitted = false
      }
    })

  }

  getEtapas() {
    this.apiEtapas.get().subscribe({
      next: async(resp) => {
        const data: any = <any> resp.data;
        this.etapas = <Etapa[]> data.data
      },
      error: (e) => {
        this.etapas = []
      }
    })
  }

  private syncEtapasToForm() {
    const etapas = this.targetEtapas.map((e, i) => ({ etapaId: e.id, orden: i + 1 }))
    this.f.etapas.setValue(etapas)
    this.f.etapas.markAsDirty()
    this.f.etapas.updateValueAndValidity()
  }

  onPickListChange() {
    this.syncEtapasToForm()
  }
}
