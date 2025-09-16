import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VacantesService } from '../../../../../services/vacantes.service';
import { environment } from '../../../../../../environments/environment';
import { Proceso } from '../../../../../interfaces/proceso.interface';
import { Departamento } from '../../../../../interfaces/departamento.interface';
import { Sede } from '../../../../../interfaces/sede.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { TalentFlowResponse } from '../../../../../interfaces/talentflow.interface';
import { ProcesosService } from '../../../../../services/procesos.service';
import { DepartamentosService } from '../../../../../services/departamentos.service';
import { SedesService } from '../../../../../services/sedes.service';
import { CommonModule } from '@angular/common';
import dayjs from 'dayjs';

// Primeng
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-vacantes-add',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './vacantes-add.component.html',
  styleUrl: './vacantes-add.component.scss'
})
export class VacantesAddComponent implements OnInit {

  private toast = inject(MessageService)
  private api = inject(VacantesService)
  private apiProcesos = inject(ProcesosService)
  private apiDepartamentos = inject(DepartamentosService)
  private apiSedes = inject(SedesService)
  private fb   = inject(FormBuilder)
  submitted = false
  env = environment

  procesos: Proceso[] = []
  departamentos: Departamento[] = []
  sedes: Sede[] = []

  @Output() changed = new EventEmitter<boolean>()
  form = this.fb.nonNullable.group({
    nombre: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
    procesoId: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
    departamentoId: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
    sedeId: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
    fechaInicio: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
    aumentoDotacion: this.fb.nonNullable.control(
      false,
      [Validators.required]
    ),
  });

  ngOnInit(): void {
    this.getData()
  }

  get f() { return this.form.controls }

  submit() {
    this.submitted = true
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    let body = this.form.getRawValue()
    body.fechaInicio = dayjs(body.fechaInicio).format('YYYY-MM-DD')
    this.api.post(body).subscribe({
      next: async(resp) => {
        this.submitted = false
        this.toast.add({ key: 'vacantes', severity: 'success', summary: this.env.appName, detail: `La vacante ${body.nombre} fue creada`, life: 6000 })
        this.form.reset()
        this.changed.emit(true)
      },
      error: (e: HttpErrorResponse) => {
        const error: TalentFlowResponse = e.error
        this.toast.add({ key: 'vacantes', severity: 'error', summary: this.env.appName, detail: error.message || 'Error al crear vacante' })
        this.submitted = false
      }
    })

  }

  getData = () => {
    this.apiDepartamentos.get().subscribe({
      next: async(resp: TalentFlowResponse) => {
        const data: any = <any> resp.data;
        this.departamentos = <Departamento[]> data.data
      },
      error: (e:HttpErrorResponse) => {
        this.departamentos = []
      }
    })
    
    this.apiProcesos.get().subscribe({
      next: async(resp: TalentFlowResponse) => {
        const data: any = <any> resp.data;
        this.procesos = <Proceso[]> data.data
      },
      error: (e:HttpErrorResponse) => {
        this.procesos = []
      }
    })
    
    this.apiSedes.get().subscribe({
      next: async(resp: TalentFlowResponse) => {
        const data: any = <any> resp.data;
        this.sedes = <Sede[]> data.data
      },
      error: (e:HttpErrorResponse) => {
        this.sedes = []
      }
    })
  }
}
