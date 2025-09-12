import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Vacante, VacanteEtapa } from '../../../../../interfaces/vacante.interface';
import { VacantesService } from '../../../../../services/vacantes.service';
import { TalentFlowResponse } from '../../../../../interfaces/talentflow.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { bItemVacantesDetail } from '../../../../../utils/breadCrumbItems';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../environments/environment';
import dayjs from 'dayjs';

// PrimeNG
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { Message, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';
import { VacantesCommentsComponent } from '../vacantes-comments/vacantes-comments.component';

@Component({
  selector: 'app-vacantes-detail',
  standalone: true,
  imports: [
    BreadcrumbModule,
    ButtonModule,
    PanelModule,
    AvatarModule,
    TagModule,
    DividerModule,
    DialogModule,
    CalendarModule,
    ToastModule,
    MessagesModule,
    TooltipModule,
    CommonModule,
    ReactiveFormsModule,
    VacantesCommentsComponent
  ],
  providers: [
    MessageService
  ],
  templateUrl: './vacantes-detail.component.html',
  styleUrl: './vacantes-detail.component.scss'
})
export class VacantesDetailComponent implements OnInit {
  
  private route = inject(ActivatedRoute)
  private api = inject(VacantesService)
  private fb   = inject(FormBuilder)
  private toast = inject(MessageService)

  bItems = bItemVacantesDetail;
  vacanteId: string = ''
  vacante: Vacante | null = null
  vacanteLoading: boolean = false
  env = environment
  disabledDates: Date[] = []

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params && params['id']) {
        this.vacanteId = params['id']
        this.getVacante()
      }
    })
  }

  getVacante(reload = false) {
    this.vacanteLoading = true
    this.api.getById(this.vacanteId).subscribe({
      next: async (resp: TalentFlowResponse) => {
        this.vacanteLoading = false
        const data: any = resp.data as any
        this.vacante = data.data as Vacante
        if(!reload) this.bItems = [...this.bItems, { label: this.vacante.nombre }]

        if(this.vacante.disabledDates) {
          this.disabledDates = this.vacante.disabledDates.map(el => dayjs(el).toDate())
        }
      },
      error: (_e: HttpErrorResponse) => {
        this.vacanteLoading = false
        this.vacante = null
      },
    })
  }

  /**
  * ############### Finalizar etapa ###############
  */
  finalizarEtapaVisible: boolean = false
  finalizarEtapaForm = this.fb.nonNullable.group({
    id: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
    fechaCumplimiento: this.fb.nonNullable.control(
      '',
      [Validators.required]
    )
  });
  get finalizarEtapaFormGetter() { return this.finalizarEtapaForm.controls }
  finalizarEtapaSubmitted = false
  finalizarEtapaMinFecha: Date = new Date()
  finalizarEtapaLoading: boolean = false

  finalizarEtapaSubmit = () => {
    this.finalizarEtapaSubmitted = true
    if (this.finalizarEtapaForm.invalid) {
      this.finalizarEtapaForm.markAllAsTouched()
      return
    }

    let body = this.finalizarEtapaForm.getRawValue()
    body.fechaCumplimiento = dayjs(body.fechaCumplimiento).format('YYYY-MM-DD')
    this.api.completarEtapa(body).subscribe({
      next: async(resp) => {
        this.toast.add({ key: 'vacante-detail', severity: 'success', summary: this.env.appName, detail: `La etapa fue finalizada`, life: 6000 })
        this.finalizarEtapaForm.reset()
        this.finalizarEtapaSubmitted = false
        this.finalizarEtapaVisible = false
        this.getVacante(true)
      },
      error: (e: HttpErrorResponse) => {
        const error: TalentFlowResponse = e.error
        this.toast.add({ key: 'vacante-detail', severity: 'error', summary: this.env.appName, detail: error.message || 'Error al finalizar etapa' })
        this.finalizarEtapaSubmitted = false
      }
    })
  }
  
  finalizarEtapaShow = (etapa: VacanteEtapa) => {
    this.finalizarEtapaMinFecha = dayjs(etapa.fechaInicio).toDate()
    this.finalizarEtapaForm.controls['id'].setValue(etapa.id)
    this.finalizarEtapaForm.controls['fechaCumplimiento'].setValue(dayjs(this.finalizarEtapaMinFecha).format('YYYY-MM-DD'))
    this.finalizarEtapaVisible = true
  }


  /**
  * ############### Editar etapa ###############
  */
  editarEtapaVisible: boolean = false
  editarEtapaForm = this.fb.nonNullable.group({
    id: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
    fechaCumplimiento: this.fb.nonNullable.control(
      '',
      [Validators.required]
    )
  });
  get editarEtapaFormGetter() { return this.editarEtapaForm.controls }
  editarEtapaSubmitted = false
  editarEtapaMinFecha: Date = new Date()
  editarEtapaLoading: boolean = false
  messages: Message[] = [{ severity: 'warn', detail: 'La modificación de la fecha de cumplimiento puede afectar las etapas subsiguientes de la vacante' }];

  editarEtapaSubmit = () => {
    this.editarEtapaSubmitted = true
    if (this.editarEtapaForm.invalid) {
      this.editarEtapaForm.markAllAsTouched()
      return
    }

    let body = this.editarEtapaForm.getRawValue()
    body.fechaCumplimiento = dayjs(body.fechaCumplimiento).format('YYYY-MM-DD')
    this.api.completarEtapa(body).subscribe({
      next: async(resp) => {
        this.toast.add({ key: 'vacante-detail', severity: 'success', summary: this.env.appName, detail: `La etapa fue finalizada`, life: 6000 })
        this.editarEtapaForm.reset()
        this.editarEtapaSubmitted = false
        this.editarEtapaVisible = false
        this.getVacante(true)
      },
      error: (e: HttpErrorResponse) => {
        const error: TalentFlowResponse = e.error
        this.toast.add({ key: 'vacante-detail', severity: 'error', summary: this.env.appName, detail: error.message || 'Error al editar etapa' })
        this.editarEtapaSubmitted = false
      }
    })
  }
  
  editarEtapaShow = (etapa: VacanteEtapa) => {
    this.editarEtapaMinFecha = dayjs(etapa.fechaInicio).toDate()
    this.editarEtapaForm.controls['id'].setValue(etapa.id)
    this.editarEtapaForm.controls['fechaCumplimiento'].setValue(dayjs(this.editarEtapaMinFecha).format('YYYY-MM-DD'))
    this.editarEtapaVisible = true
  }
  
}
