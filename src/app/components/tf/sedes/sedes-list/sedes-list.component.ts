import { Component, inject, OnInit } from '@angular/core';
import { SedesService } from '../../../../services/sedes.service';
import { bItemSedesList } from '../../../../utils/breadCrumbItems';
import { environment } from '../../../../../environments/environment';
import { Sede } from '../../../../interfaces/sede.interface';

// Primeng
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

// Components
import { SedesAddComponent } from '../sedes-add/sedes-add.component';
import { SedesEditComponent } from '../sedes-edit/sedes-edit.component';

@Component({
  selector: 'app-sedes-list',
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
    TagModule,
    DialogModule,
    ConfirmPopupModule,
    CommonModule,
    SedesAddComponent,
    SedesEditComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './sedes-list.component.html',
  styleUrl: './sedes-list.component.scss'
})
export class SedesListComponent implements OnInit {
  private toast = inject(MessageService)
  private api = inject(SedesService)
  private confirm = inject(ConfirmationService)
  bItems = bItemSedesList
  env = environment
  loading: boolean = false
  sedes: Sede[] = []
  addVisible: boolean = false
  editVisible: boolean = false
  editSede!: Sede
  deleteLoading: boolean = false

  async ngOnInit() {
    this.getSedes()
  }
  
  getSedes() {
    this.loading = true
    this.api.get().subscribe({
      next: async(resp) => {
        const data: any = <any> resp.data;
        this.sedes = <Sede[]> data.data
        this.loading = false
      },
      error: (e) => {
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: 'Error al obtener sedes' });
        this.loading = false
      }
    })
  }

  editOpenModal = (s:any) => {
    this.editSede = <Sede> s
    this.editVisible = true
  }

  editOnClose = (_:any) => {
    this.getSedes()
    this.editVisible = false
  }
  
  addOnClose = (_:any) => {
    this.getSedes()
    this.addVisible = false
  }

  deleteRequest(event: Event, sede: Sede) {
    this.confirm.confirm({
        target: event.target as EventTarget,
        message: '¿Querés eliminar este recurso?. Esta acción no puede deshacerse.',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.deleteSede(sede)
        },
        reject: () => {},
        acceptLabel: 'Sí, eliminar'
    });
  }

  deleteSede = (sede: Sede) => {
    this.deleteLoading = true
    this.api.delete(sede.id).subscribe({
      next: async() => {
        this.deleteLoading = false
        this.getSedes()
      },
      error: (e) => {
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: 'Error al eliminar sede' });
        this.deleteLoading = false
      }
    })
  }
}
