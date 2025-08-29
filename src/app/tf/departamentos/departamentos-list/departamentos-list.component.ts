import { Component, inject, OnInit } from '@angular/core';
import { bItemDepartamentosList } from '../../../utils/breadCrumbItems';
import { environment } from '../../../../environments/environment';
import { DepartamentosService } from '../../../services/departamentos.service';
import { Departamento } from '../../../interfaces/departamento.service';

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
import { DepartamentosAddComponent } from '../departamentos-add/departamentos-add.component';
import { DepartamentosEditComponent } from '../departamentos-edit/departamentos-edit.component';

@Component({
  selector: 'app-departamentos-list',
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
    DepartamentosAddComponent,
    DepartamentosEditComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './departamentos-list.component.html',
  styleUrl: './departamentos-list.component.scss'
})
export class DepartamentosListComponent implements OnInit {

  private toast = inject(MessageService)
  private api = inject(DepartamentosService)
  private confirm = inject(ConfirmationService)
  bItems = bItemDepartamentosList
  env = environment
  loading: boolean = false
  departamentos: Departamento[] = []
  addVisible: boolean = false
  editVisible: boolean = false
  editDep!: Departamento
  deleteLoading: boolean = false

  async ngOnInit() {
    this.getDepartamentos()
  }
  
  getDepartamentos() {
    this.loading = true
    this.api.get().subscribe({
      next: async(resp) => {
        const data: any = <any> resp.data;
        this.departamentos = <Departamento[]> data.data
        this.loading = false
      },
      error: (e) => {
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: 'Error al obtener departamentos' });
        this.loading = false
      }
    })
  }

  editOpenModal = (s:any) => {
    this.editDep = <Departamento> s
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

  deleteRequest(event: Event, departamento: Departamento) {
    this.confirm.confirm({
        target: event.target as EventTarget,
        message: '¿Querés eliminar este recurso?. Esta acción no puede deshacerse.',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.deleteSede(departamento)
        },
        reject: () => {},
        acceptLabel: 'Sí, eliminar'
    });
  }

  deleteSede = (departamento: Departamento) => {
    this.deleteLoading = true
    this.api.delete(departamento.id).subscribe({
      next: async() => {
        this.deleteLoading = false
        this.getDepartamentos()
      },
      error: (e) => {
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: 'Error al eliminar departamento' });
        this.deleteLoading = false
      }
    })
  }
}
