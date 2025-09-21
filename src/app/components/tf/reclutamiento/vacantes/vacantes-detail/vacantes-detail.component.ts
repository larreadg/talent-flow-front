import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Vacante, VacanteEtapa } from '../../../../../interfaces/vacante.interface';
import { VacantesService } from '../../../../../services/vacantes.service';
import { TalentFlowResponse } from '../../../../../interfaces/talentflow.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { bItemVacantesDetail } from '../../../../../utils/breadCrumbItems';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../environments/environment';
import { KvStoreService } from '../../../../../services/kv-store.service';
import { ReportesService } from '../../../../../services/reportes.service';
import * as htmlToImage from 'html-to-image';
import dayjs from 'dayjs';

// Components
import { VacantesCommentsComponent } from '../vacantes-comments/vacantes-comments.component';
import { VacantesEditComponent } from '../vacantes-edit/vacantes-edit.component';

// PrimeNG
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { TabViewModule } from 'primeng/tabview';

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
    TableModule,
    CommonModule,
    MenuModule,
    ReactiveFormsModule,
    TabViewModule,
    VacantesCommentsComponent,
    VacantesEditComponent
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
  private kv = inject(KvStoreService)
  private apiReportes = inject(ReportesService)

  bItems = bItemVacantesDetail;
  vacanteId: string = ''
  vacante: Vacante | null = null
  vacanteLoading: boolean = false
  env = environment
  disabledDates: Date[] = []

  menuItems: MenuItem[] = [
    {
      label: 'Exportar a Excel',
      icon: 'pi pi-file-excel',
      command: () => {
      }
    }
  ]

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
        const meta: any = data.meta as any
        if(!reload) this.bItems = [...this.bItems, { label: this.vacante.nombre }]

        if(this.vacante.disabledDates) {
          this.disabledDates = this.vacante.disabledDates.map(el => dayjs(el).toDate())
        }
        this.resumenTotalDias = meta.totalDiasHabilesUnicos
        this.resumenTotalRetraso = meta.totalDiasRetrasosUnicos
        this.resumenList = [...(this.vacante?.etapasVacante ?? [])]
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
  messages: Message[] = [{ severity: 'warn', detail: 'La modificación de la fecha de cumplimiento afecta a las siguientes etapas' }];

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
  
  /**
  * ############### Resumen visible ###############
  */
  resumenVisible: boolean = false
  resumenList: VacanteEtapa[] = []
  resumenTotalDias: number = 0
  resumenTotalRetraso: number = 0

  /**
  * ############### Edit visible ###############
  */
  editVisible = false;

  editShow(){
    this.editVisible = true
  }

  editClose($_:any) {
    this.editVisible = false
    this.getVacante(true)
  }

  updateComments(total:number, etapa: VacanteEtapa) {
    etapa._count.comentarios = total
  }

  /**
   * ############### Reporte ###############
   */

  reporteParams = {
    id: '',
    token: ''
  };

  private parseFilenameFromCD(cd: string | null): string | null {
    if (!cd) return null;
    // ej: attachment; filename="vacantes_20250914_1030.xlsx"
    const m = /filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec(cd);
    return m ? decodeURIComponent(m[1].replace(/\"/g, '')) : null;
  }
  
  reporteDownload = async () => {
    this.reporteParams.id = <string> this.vacante?.id
    const token = await this.kv.get('token');
    if (!token) return;
  
    this.reporteParams.token = String(token);
  
    const popup = window.open('', '_blank');
    if (!popup) {
      // fallback si el bloqueador canceló el popup
      // muestra toast o descargá en la misma pestaña
      // this.toastr.error('Habilitá popups para descargar el reporte');
      return;
    }
    // Mensaje de espera en el popup
    popup.document.write('<!doctype html><title>Generando reporte…</title><p style="font-family:sans-serif">Generando reporte…</p>');
    popup.opener = null; // seguridad
  
    this.apiReportes.get(this.reporteParams).subscribe({
      next: (res) => {
        const blob = res.body!;
        const cd = res.headers.get('Content-Disposition');
        const filename = this.parseFilenameFromCD(cd) ?? `reporte_${new Date().toISOString().slice(0,10)}.xlsx`;
  
        const url = URL.createObjectURL(blob);
  
        // Forzar descarga en el popup preservando el filename
        popup.document.body.innerHTML = `
          <a id="dl" href="${url}" download="${filename}" style="display:none"></a>
          <script>document.getElementById('dl').click();</script>
          <p style="font-family:sans-serif">Si la descarga no comenzó, <a href="${url}" download="${filename}">haz clic aquí</a>.</p>
        `;
  
        // liberar luego de un rato
        setTimeout(() => URL.revokeObjectURL(url), 60_000);

      },
      error: (err) => {
        popup.close();
        // this.toastr.error('No se pudo generar el reporte');
        console.error(err);
      }
    });
  };

  /**
   * ############### Export ###############
   */

  @ViewChild('exportWrap', { static: false }) exportWrap!: ElementRef<HTMLDivElement>;

  get nowLabel() {
    return dayjs().format('ddd, DD [de] MMM [de] YYYY HH:mm');
  }

  
  // === UTIL PRINCIPAL: clona y renderiza con ancho fijo usando SOLO html-to-image ===
  private async renderOffscreenPng(targetWidthPx = 1600, pixelRatio = 2): Promise<string> {
    const src = this.exportWrap.nativeElement;
  
    // 1) Clonar el nodo a exportar
    const clone = src.cloneNode(true) as HTMLElement;
    clone.classList.add('export-mode');
  
    // 2) Sandbox off-screen
    const sandbox = document.createElement('div');
    sandbox.style.position = 'fixed';
    sandbox.style.left = '-10000px';
    sandbox.style.top = '0';
    sandbox.style.background = '#ffffff';
  
    // 3) Wrapper con ancho fijo
    const wrapper = document.createElement('div');
    wrapper.style.width = `${targetWidthPx}px`;
    wrapper.style.background = '#ffffff';
    wrapper.style.padding = '16px';
    wrapper.appendChild(clone);
    sandbox.appendChild(wrapper);
    document.body.appendChild(sandbox);
  
    // ---- 🔧 Anti-scroll: quitar overflow/altos fijos en el clon ----
    const killScrolls = (root: HTMLElement) => {
      const selectors = [
        '[style*="overflow"]',
        '.p-datatable-wrapper',
        '.p-datatable-scrollable-body',
        '.p-datatable-scrollable-header',
        '.p-datatable-scrollable-footer',
        '.p-scrollpanel',
        '.p-scrollpanel-content',
        '.p-scrollpanel-wrapper'
      ].join(',');
      root.querySelectorAll<HTMLElement>(selectors).forEach(el => {
        el.style.overflow = 'visible';
        el.style.maxHeight = 'none';
        el.style.height = 'auto';
      });
  
      // Si tu layout usa contenedores con altura fija:
      root.querySelectorAll<HTMLElement>('[style*="height"]').forEach(el => {
        // No tocar alturas explícitas de filas/celdas, solo contenedores
        const tag = el.tagName.toLowerCase();
        if (!['tr','td','th'].includes(tag)) {
          el.style.height = 'auto';
          el.style.maxHeight = 'none';
        }
      });
    };
    killScrolls(clone);
    // ---------------------------------------------------------------
  
    try {
      // Esperar fuentes (PrimeIcons)
      // @ts-ignore
      if (document?.fonts?.ready) await (document as any).fonts.ready;
  
      // Dos frames para asegurar layout
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
  
      // Medir alto real (ya sin scroll)
      const rect = wrapper.getBoundingClientRect();
      const targetHeightPx = Math.ceil(rect.height || wrapper.scrollHeight);
  
      // Renderizar
      const dataUrl = await htmlToImage.toPng(wrapper, {
        pixelRatio,
        backgroundColor: '#ffffff',
        width: targetWidthPx,
        height: targetHeightPx,
        cacheBust: true,
        style: { transform: 'none' }
      });
  
      return dataUrl;
    } finally {
      document.body.removeChild(sandbox);
    }
  }
  
  async exportPNG() {
    try {
      const png = await this.renderOffscreenPng(2000, 2);
      const a = document.createElement('a');
      a.href = png;
      a.download = `reporte-etapas_${dayjs().format('YYYYMMDD_HHmmss')}.png`;
      a.click();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * ############### Panel controls ###############
  */

  ix = 0; // pestaña inicial
  loaded: { [key: number]: boolean } = { 1: true, 2: false, 3: false };

  onTabChange({ index }: { index: number }) {
    // apagar todas
    Object.keys(this.loaded).forEach(k => this.loaded[+k] = false);
    // encender la actual (TabView es 0-based → sumamos 1)
    this.loaded[index + 1] = true;
  }

}
