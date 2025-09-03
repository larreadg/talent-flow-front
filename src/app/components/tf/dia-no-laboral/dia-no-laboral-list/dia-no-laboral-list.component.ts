import { Component, inject } from '@angular/core';
import { DiaNoLaboral } from '../../../../interfaces/dia-no-laboral.interface';
import { DiaNoLaboralService } from '../../../../services/dia-no-laboral.service';
import { bItemDiaNoLaboralList } from '../../../../utils/breadCrumbItems';
import { environment } from '../../../../../environments/environment';


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
import { DiaNoLaboralAddComponent } from '../dia-no-laboral-add/dia-no-laboral-add.component';
import { DiaNoLaboralEditComponent } from '../dia-no-laboral-edit/dia-no-laboral-edit.component';
import dayjs from 'dayjs';

@Component({
  selector: 'app-dia-no-laboral-list',
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
    DiaNoLaboralAddComponent,
    DiaNoLaboralEditComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './dia-no-laboral-list.component.html',
  styleUrl: './dia-no-laboral-list.component.scss'
})
export class DiaNoLaboralListComponent {
  private toast = inject(MessageService)
  private api = inject(DiaNoLaboralService)
  private confirm = inject(ConfirmationService)
  bItems = bItemDiaNoLaboralList
  env = environment
  loading: boolean = false
  dias: DiaNoLaboral[] = []
  addVisible: boolean = false
  editVisible: boolean = false
  editDnl!: DiaNoLaboral
  deleteLoading: boolean = false

  async ngOnInit() {
    this.getDepartamentos()
  }
  
  getDepartamentos() {
    this.loading = true
    this.api.get().subscribe({
      next: async(resp) => {
        const data: any = <any> resp.data;
        this.dias = <DiaNoLaboral[]> data.data.map((el:DiaNoLaboral) => {
          el.fecha = dayjs(el.fecha).format('YYYY-MM-DD')
          return el
        })
        this.loading = false
      },
      error: (e) => {
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: 'Error al obtener dias' });
        this.loading = false
      }
    })
  }

  editOpenModal = (s:any) => {
    this.editDnl = <DiaNoLaboral> s
    this.editVisible = true
  }

  editOnClose = (_:any) => {
    this.getDepartamentos()
    this.editVisible = false
  }
  
  addOnClose = (_:any) => {
    this.getDepartamentos()
    this.addVisible = false
  }

  deleteRequest(event: Event, dia: DiaNoLaboral) {
    this.confirm.confirm({
        target: event.target as EventTarget,
        message: '¿Querés eliminar este recurso?. Esta acción no puede deshacerse.',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.deleteSede(dia)
        },
        reject: () => {},
        acceptLabel: 'Sí, eliminar'
    });
  }

  deleteSede = (dia: DiaNoLaboral) => {
    this.deleteLoading = true
    this.api.delete(dia.id).subscribe({
      next: async() => {
        this.deleteLoading = false
        this.getDepartamentos()
      },
      error: (e) => {
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: 'Error al eliminar dia' });
        this.deleteLoading = false
      }
    })
  }
}
