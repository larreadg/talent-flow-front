import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { bItemVacantesList } from '../../../../../utils/breadCrumbItems';
import { VacantesService } from '../../../../../services/vacantes.service';
import { environment } from '../../../../../../environments/environment';
import { Vacante } from '../../../../../interfaces/vacante.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Primeng
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';

// Components
import { VacantesAddComponent } from '../vacantes-add/vacantes-add.component';
import { VacantesEditComponent } from '../vacantes-edit/vacantes-edit.component';

@Component({
  selector: 'app-vacantes-list',
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
    FormsModule,
    CommonModule,
    VacantesAddComponent,
    VacantesEditComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './vacantes-list.component.html',
  styleUrl: './vacantes-list.component.scss'
})
export class VacantesListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  private toast = inject(MessageService);
  private api = inject(VacantesService);
  private confirm = inject(ConfirmationService);

  bItems = bItemVacantesList;
  env = environment;

  loading = false;
  vacantes: Vacante[] = [];
  totalRecords = 0;

  // estado de paginación/busqueda
  rows = 10;         // page size por defecto
  search = '';       // filtro de texto actual
  lastLazyState?: TableLazyLoadEvent;

  // modales
  addVisible = false;
  editVisible = false;
  editVacante!: Vacante;
  deleteLoading = false;

  ngOnInit() {}

  loadVacantes = (event?: TableLazyLoadEvent) => {
    this.lastLazyState = event ?? this.lastLazyState ?? { first: 0, rows: this.rows };
    const first = this.lastLazyState.first ?? 0;
    const rows = this.lastLazyState.rows ?? this.rows;

    const offset = first;
    const limit = rows;
    const filter = this.search?.trim() ? this.search.trim() : null;

    this.loading = true;
    this.api.get(limit, offset, filter).subscribe({
      next: (resp: any) => {
        // backend devuelve { data: { data: Vacante[], meta: {...} } } en tu código actual
        const payload = resp.data;
        this.vacantes = payload.data;
        this.totalRecords = payload.meta.total;
        this.rows = payload.meta.limit ?? rows;
        this.loading = false;
      },
      error: () => {
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: 'Error al obtener vacantes' });
        this.loading = false;
      }
    });
  };

  // Buscar con debounce (simple)
  private filterTimer?: any;
  onFilter(value: string) {
    this.search = value ?? '';
    clearTimeout(this.filterTimer);
    this.filterTimer = setTimeout(() => {
      // resetear a primera página
      this.dt.first = 0;
      this.loadVacantes({ first: 0, rows: this.rows });
    }, 300);
  }

  // --- tus handlers de edición/alta/eliminación sin cambios, solo llaman loadVacantes() al cerrar
  editOpenModal = (s: any) => { this.editVacante = s as Vacante; this.editVisible = true; };
  editOnClose = (_: any) => { this.loadVacantes({ first: this.dt.first ?? 0, rows: this.rows }); this.editVisible = false; };
  addOnClose  = (_: any) => { this.loadVacantes({ first: 0, rows: this.rows }); this.addVisible = false; };

  deleteRequest(event: Event, v: Vacante) {
    this.confirm.confirm({
      target: event.target as EventTarget,
      message: '¿Querés eliminar este recurso?. Esta acción no puede deshacerse.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      accept: () => this.deleteSede(v),
    });
  }

  deleteSede = (v: Vacante) => {
    this.deleteLoading = true;
    this.api.delete(v.id).subscribe({
      next: () => {
        this.deleteLoading = false;
        this.loadVacantes({ first: this.dt.first ?? 0, rows: this.rows });
      },
      error: () => {
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: 'Error al eliminar departamento' });
        this.deleteLoading = false;
      }
    });
  };
}
