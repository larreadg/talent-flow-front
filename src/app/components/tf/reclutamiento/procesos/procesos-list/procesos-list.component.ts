import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ProcesosService } from '../../../../../services/procesos.service';
import { bItemProcesosList } from '../../../../../utils/breadCrumbItems';
import { environment } from '../../../../../../environments/environment';
import { Proceso } from '../../../../../interfaces/proceso.interface';

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
import { AvatarModule } from 'primeng/avatar';

// Components
import { ProcesosAddComponent } from '../procesos-add/procesos-add.component';

@Component({
  selector: 'app-procesos-list',
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
    AvatarModule,
    CommonModule,
    ProcesosAddComponent
  ],
  providers: [MessageService],
  templateUrl: './procesos-list.component.html',
  styleUrl: './procesos-list.component.scss'
})
export class ProcesosListComponent implements OnInit {
  private toast = inject(MessageService)
  private api = inject(ProcesosService)
  bItems = bItemProcesosList
  env = environment
  loading: boolean = false
  procesos: Proceso[] = []
  addVisible: boolean = false

  ngOnInit() {
    this.getProcesos()
  }
  
  getProcesos() {
    this.loading = true
    this.api.get().subscribe({
      next: async(resp) => {
        const data: any = <any> resp.data;
        this.procesos = <Proceso[]> data.data
        this.loading = false
      },
      error: (e) => {
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: 'Error al obtener procesos' });
        this.loading = false
      }
    })
  }

  addOnClose = (_:any) => {
    this.getProcesos()
    this.addVisible = false
  }

}
