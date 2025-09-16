import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
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
import { Vacante } from '../../../../../interfaces/vacante.interface';
import { vacantesEstadosEditable, vacantesResultados } from '../../../../../utils/utils';
import dayjs from 'dayjs';

// Primeng
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-vacantes-edit',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    MessagesModule,
    CheckboxModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './vacantes-edit.component.html',
  styleUrl: './vacantes-edit.component.scss'
})
export class VacantesEditComponent {
  @Input() set vacante(vacante:Vacante | null) {
    if(vacante) {
      this.setInfo(vacante)
      this.vacanteEstado = vacante.estado
    }
  }

  private toast = inject(MessageService)
  private api = inject(VacantesService)
  private apiProcesos = inject(ProcesosService)
  private apiDepartamentos = inject(DepartamentosService)
  private apiSedes = inject(SedesService)
  private fb   = inject(FormBuilder)
  messages: Message[] = [{ severity: 'warn', detail: 'La modificación de la fecha de inicio, afecta a las etapas de la vacante' }];
  submitted = false
  env = environment
  vacantesEstados = vacantesEstadosEditable
  vacantesResultados = vacantesResultados
  vacanteEstado: 'abierta' | 'finalizada' | 'pausada' | 'cancelada' = 'abierta'

  procesos: Proceso[] = []
  departamentos: Departamento[] = []
  sedes: Sede[] = []

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
    estado: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
    aumentoDotacion: this.fb.nonNullable.control(
      false,
      [Validators.required]
    ),
    resultado: this.fb.nonNullable.control(
      null as any,
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
    this.api.patch(body).subscribe({
      next: async(resp) => {
        this.submitted = false
        this.toast.add({ key: 'vacante-detail', severity: 'success', summary: this.env.appName, detail: `La vacante ${body.nombre} fue actualizada`, life: 6000 })
        this.form.reset()
        this.changed.emit(true)
      },
      error: (e: HttpErrorResponse) => {
        const error: TalentFlowResponse = e.error
        this.toast.add({ key: 'vacante-detail', severity: 'error', summary: this.env.appName, detail: error.message || 'Error al actualizar vacante' })
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

  setInfo(vacante: Vacante) {
    this.form.controls['nombre'].setValue(vacante.nombre)
    this.form.controls['departamentoId'].setValue(vacante.departamentoId)
    this.form.controls['sedeId'].setValue(vacante.sedeId)
    this.form.controls['fechaInicio'].setValue(vacante.fechaInicio)
    this.form.controls['id'].setValue(vacante.id)
    this.form.controls['estado'].setValue(vacante.estado)
    this.form.controls['aumentoDotacion'].setValue(vacante.aumentoDotacion)
    this.form.controls['resultado'].setValue(vacante.resultado)
  }
}
