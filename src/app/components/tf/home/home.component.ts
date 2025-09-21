import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { VacantesService } from '../../../services/vacantes.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReportesService } from '../../../services/reportes.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import { ChartData, ChartOptions } from 'chart.js';
Chart.register(DataLabelsPlugin);
import dayjs from 'dayjs';
import * as htmlToImage from 'html-to-image';

// Primeng
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { BreadcrumbModule } from "primeng/breadcrumb";
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardModule,
    BadgeModule,
    ButtonModule,
    ChartModule,
    TableModule,
    TagModule,
    AvatarModule,
    TooltipModule,
    CommonModule,
    RouterLink,
    BreadcrumbModule
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  
  private apiVacantes = inject(VacantesService)
  private apiReportes = inject(ReportesService)
  private router = inject(Router)
  
  env = environment
  vacantesEstadosLoading: boolean = false
  vacantesEstados: any[] = []

  ngOnInit(): void {
    this.getResumenPorEstado()
    this.getSLAResumenMaximo()
    this.getTopDepartamentosIncumplimiento()
    this.getResumenVacantesUltimos12Meses()
  }

  getResumenPorEstado() {
    this.vacantesEstadosLoading = true
    this.apiVacantes.getResumenPorEstado().subscribe({
      next: async(resp) => {
        this.vacantesEstados = <any[]> resp.data
        this.vacantesEstadosLoading = false
      },
      error: (e) => {
        this.vacantesEstados = []
        this.vacantesEstadosLoading = false
      }
    })
  }

  addVacanteOpen = () => {
    this.router.navigate(['/tf/reclutamiento/vacantes'], { queryParams: { modal: 'add' } })
  }

  /**
   * ########### Reporte cumplimiento SLA Maximo
   */
  cSMItems: { dentroSLA: number, fueraSLA: number } = { dentroSLA: 0, fueraSLA: 0 }
  cSMLoading: boolean = false
  cSMValue = 0
  csmData: ChartData<'doughnut'> = {
    labels: ['Dentro SLA', 'Fuera SLA'],
    datasets: [
      {
        data: [0, 0],
        // Colores fijos (volvemos a la versión inicial)
        backgroundColor: ['#06b6d4', '#ec4899'],
        hoverBackgroundColor: ['#5cc7e0', '#fc86c0'],
        borderWidth: 0,
      },
    ],
  };
  csmOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true } },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed as number;
            const ds = ctx.dataset.data as number[];
            const total = ds.reduce((a, b) => a + (b || 0), 0) || 1;
            const pct = (val / total) * 100;
            return `${ctx.label}: ${val} (${pct.toFixed(1)}%)`;
          },
        },
      },
      // 👇 Etiquetas sobre las porciones
      datalabels: {
        display: (ctx: any) => {
          const v = (ctx.dataset.data as number[])[ctx.dataIndex] || 0;
          return v > 0; // no muestres si es cero
        },
        formatter: (value: any, ctx: any) => {
          const ds = ctx.dataset.data as number[];
          const total = ds.reduce((a, b) => a + (b || 0), 0) || 1;
          const pct = Math.round((Number(value) / total) * 100);
          return `${value} (${pct}%)`;
        },
        color: '#fff',
        font: { weight: 'bold' },
        anchor: 'center',
        align: 'center',
        clamp: true,
      } as any, // si TS se queja, dejá este 'as any'
    },
  };

  getSLAResumenMaximo() {
    this.cSMLoading = true
    this.apiReportes.getSLAResumenMaximo().subscribe({
      next: async(resp) => {
        const data = <any> resp.data
        this.cSMItems.dentroSLA = data.dentroSLA
        this.cSMItems.fueraSLA = data.fueraSLA
        this.cSMValue = data.procesos[0]?.slaMaximoDias
        this.cSMLoading = false
        this.csmData = {
          ...this.csmData,
          datasets: [
            { ...(this.csmData.datasets[0] as any), data: [this.cSMItems.dentroSLA, this.cSMItems.fueraSLA] }
          ]
        };
      },
      error: (e) => {
        this.cSMItems = { dentroSLA: 0, fueraSLA: 0 };
        this.csmData = { ...this.csmData, datasets: [{ ...(this.csmData.datasets[0] as any), data: [0, 0] }] };
        this.cSMLoading = false
      }
    })
  }

  /**
   * ########### Reporte Top 5 incumplimiento
   */
  t5List: any[] = []
  t5 = 5
  t5Loading: boolean = false

  getTopDepartamentosIncumplimiento() {
    this.apiReportes.getTopIncumplimiento(this.t5).subscribe({
      next: (resp) => {
        const data: any = resp.data
        this.t5List = (data.items ?? []) as Array<{ nombre: string; incumplimientos: number }>;
        this.t5Loading = false
      },
      error: () => {
        this.t5List = []
        this.t5Loading = false
      }
    });
  }

  /**
  * ########### Reporte ultimos 12 meses
  */
  res12List: any[] = []
  res12Loading: boolean = false
  res12Data: any;
  res12Options: any;

  getResumenVacantesUltimos12Meses() {
    this.res12Loading = true
    this.apiReportes.getResumenVacantesUltimos12Meses().subscribe({
      next: (resp) => {
        this.res12List = resp.data as any[]
        this.buildRes12Chart()
        this.res12Loading = false
        this.res12Loading = false
      },
      error: () => {
        this.res12Loading = false
      }
    });
  }

  private buildRes12Chart() {
    const labels = this.res12List.map(m => m.label);
    const abiertas = this.res12List.map(m => m.abiertas ?? 0);
    const finalizadas = this.res12List.map(m => m.finalizadas ?? 0);
    const aumentos = this.res12List.map(m => m.aumentoDotacion ?? 0);
  
    this.res12Data = {
      labels,
      datasets: [
        {
          label: 'Abiertas',
          data: abiertas,
          backgroundColor: '#06b6d4',
          borderRadius: 6,
          barPercentage: 0.85,
          categoryPercentage: 0.7,
        },
        {
          label: 'Finalizadas',
          data: finalizadas,
          backgroundColor: '#22c55e',
          borderRadius: 6,
          barPercentage: 0.85,
          categoryPercentage: 0.7,
        },
        {
          label: 'Aumento de dotación',
          data: aumentos,
          backgroundColor: '#ec4899',
          borderRadius: 6,
          barPercentage: 0.85,
          categoryPercentage: 0.7,
        },
      ],
    };
  
    const text = '#475569';   // slate-600
    const grid = '#e2e8f0';   // slate-200
  
    this.res12Options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: text }
        },
        tooltip: { mode: 'index', intersect: false },
      },
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          ticks: { color: text },
          grid: { color: grid, drawBorder: false },
        },
        y: {
          beginAtZero: true,
          ticks: { color: text, precision: 0, stepSize: 1 },
          grid: { color: grid, drawBorder: false },
        },
      },
    };
  }

  /**
  * ########### Exportar graficos
  */
  private async renderOffscreenPng(targetWidthPx = 1600, pixelRatio = 2, exportWrap: HTMLDivElement): Promise<string> {
    const src = exportWrap;
  
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

    this.copyCanvases(src, clone);
  
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
  
  async exportPNG(el: HTMLDivElement, exportName: string) {
    try {
      const width = el.getBoundingClientRect().width;
      const png = await this.renderOffscreenPng(width, 2, el);
      const a = document.createElement('a');
      a.href = png;
      a.download = `${exportName}_${dayjs().format('YYYYMMDD_HHmmss')}.png`;
      a.click();
    } catch (e) {
      console.error(e);
    }
  }

  copyCanvases = (srcRoot: HTMLElement, cloneRoot: HTMLElement) => {
    const srcCanvases   = Array.from(srcRoot.querySelectorAll<HTMLCanvasElement>('canvas'));
    const cloneCanvases = Array.from(cloneRoot.querySelectorAll<HTMLCanvasElement>('canvas'));
    srcCanvases.forEach((srcCanvas, i) => {
      const dst = cloneCanvases[i];
      if (!dst) return;
      // Igualar tamaño y dibujar
      dst.width  = srcCanvas.width;
      dst.height = srcCanvas.height;
      const ctx = dst.getContext('2d');
      if (ctx) ctx.drawImage(srcCanvas, 0, 0);
    });
  };
}
