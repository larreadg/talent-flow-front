import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EtapasService } from '../../../../../services/etapas.service';
import { bItemEtapasList } from '../../../../../utils/breadCrumbItems';
import { environment } from '../../../../../../environments/environment';
import { Etapa } from '../../../../../interfaces/etapa.interface';

// Primeng
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

// Components
import { EtapasAddComponent } from '../etapas-add/etapas-add.component';

@Component({
  selector: 'app-etapas-list',
  standalone: true,
  imports: [
    BreadcrumbModule,
    ButtonModule,
    ToastModule,
    TableModule,
    TooltipModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    DialogModule,
    CommonModule,
    EtapasAddComponent
  ],
  providers: [MessageService],
  templateUrl: './etapas-list.component.html',
  styleUrl: './etapas-list.component.scss'
})
export class EtapasListComponent implements OnInit {
  private toast = inject(MessageService)
  private api = inject(EtapasService)
  bItems = bItemEtapasList
  env = environment
  loading: boolean = false
  etapas: Etapa[] = []
  addVisible: boolean = false

  ngOnInit() {
    this.getEtapas()
  }
  
  getEtapas() {
    this.loading = true
    this.api.get().subscribe({
      next: async(resp) => {
        const data: any = <any> resp.data;
        this.etapas = <Etapa[]> data.data
        this.loading = false
      },
      error: (e) => {
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: 'Error al obtener etapas' });
        this.loading = false
      }
    })
  }

  addOnClose = (_:any) => {
    this.getEtapas()
    this.addVisible = false
  }
}
