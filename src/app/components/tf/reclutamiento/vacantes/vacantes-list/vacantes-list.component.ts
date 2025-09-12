import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { bItemVacantesList } from '../../../../../utils/breadCrumbItems';
import { VacantesService } from '../../../../../services/vacantes.service';
import { environment } from '../../../../../../environments/environment';
import { Vacante } from '../../../../../interfaces/vacante.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { vacantesEstados } from '../../../../../utils/utils';
import { DepartamentosService } from '../../../../../services/departamentos.service';
import { SedesService } from '../../../../../services/sedes.service';
import { Departamento } from '../../../../../interfaces/departamento.interface';
import { Sede } from '../../../../../interfaces/sede.interface';
import { TalentFlowResponse } from '../../../../../interfaces/talentflow.interface';
import { HttpErrorResponse } from '@angular/common/http';

// PrimeNG
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';

// Components
import { VacantesAddComponent } from '../vacantes-add/vacantes-add.component';

type SortDir = 1 | -1;

@Component({
  selector: 'app-vacantes-list',
  standalone: true,
  imports: [
    BreadcrumbModule,
    ButtonModule,
    AvatarModule,
    ToastModule,
    TableModule,
    TooltipModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    PanelModule,
    DialogModule,
    ConfirmPopupModule,
    MultiSelectModule,
    FormsModule,
    ProgressBarModule,
    CommonModule,
    VacantesAddComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './vacantes-list.component.html',
  styleUrl: './vacantes-list.component.scss',
})
export class VacantesListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  private toast = inject(MessageService);
  private api = inject(VacantesService);
  private apiDepartamentos = inject(DepartamentosService);
  private apiSedes = inject(SedesService);
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  bItems = bItemVacantesList;
  env = environment;

  loading = false;
  vacantes: Vacante[] = [];
  totalRecords = 0;

  // paginación
  rows = 10;
  lastLazyState?: TableLazyLoadEvent;

  // modales
  addVisible = false;
  editVisible = false;
  editVacante!: Vacante;
  deleteLoading = false;

  // catálogos
  estadoOptions = [
    { label: 'Abierta', value: 'abierta' },
    { label: 'Pausada', value: 'pausada' },
    { label: 'Finalizada', value: 'finalizada' },
    { label: 'Cancelada', value: 'cancelada' },
  ];
  vacantesEstados = vacantesEstados;
  departamentos: Departamento[] = [];
  sedes: Sede[] = [];
  departamentosLoading = false;
  sedesLoading = false;

  // ===== Persistencia filtros =====
  private STORAGE_KEY = `${this.env.appName}__vacantes_filtros_v1`;

  // Lo que usa la tabla/API
  filtrosApplied = this.getDefaultFilters();
  // Lo que edita el usuario en el panel (no dispara API hasta Buscar)
  filtrosDraft   = this.getDefaultFilters();

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params && params['modal'] && params['modal'] === 'add') {
        this.addVisible = true

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { modal: null },
          queryParamsHandling: 'merge', // mantiene el resto de los params
        })
      }
    })
    this.restoreFilters();            // localStorage → applied & draft
    this.getData();                   // catálogos
    this.loadVacantes({ first: 0, rows: this.rows }); // primera carga
  }

  // Defaults / restore / persist
  private getDefaultFilters() {
    return {
      search: '',
      estados: this.estadoOptions.map(o => o.value), // TODOS
      departamentos: [] as string[],
      sedes: [] as string[],
      sortBy: 'nombre',
      sortDir: 1 as SortDir,
    };
  }

  private restoreFilters() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        const base = this.getDefaultFilters();
        this.filtrosApplied = {
          search: p.search ?? base.search,
          estados: Array.isArray(p.estados) && p.estados.length ? p.estados : base.estados,
          departamentos: Array.isArray(p.departamentos) ? p.departamentos : base.departamentos,
          sedes: Array.isArray(p.sedes) ? p.sedes : base.sedes,
          sortBy: p.sortBy ?? base.sortBy,
          sortDir: p.sortDir === -1 ? -1 : 1,
        };
        this.filtrosDraft = { ...this.filtrosApplied };
      } else {
        this.filtrosApplied = this.getDefaultFilters();
        this.filtrosDraft   = this.getDefaultFilters();
      }
    } catch {
      this.filtrosApplied = this.getDefaultFilters();
      this.filtrosDraft   = this.getDefaultFilters();
    }
  }

  private persistApplied() {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.filtrosApplied)); } catch {}
  }

  // ===== Acciones del panel =====
  onBuscarClick() {
    const estados = this.filtrosDraft.estados?.length
      ? this.filtrosDraft.estados
      : this.estadoOptions.map(o => o.value);

    this.filtrosApplied = {
      ...this.filtrosApplied, // preserva sortBy/sortDir (los maneja la tabla)
      search: this.filtrosDraft.search?.trim() || '',
      estados,
      departamentos: this.filtrosDraft.departamentos ?? [],
      sedes: this.filtrosDraft.sedes ?? [],
    };

    this.persistApplied();
    if (this.dt) this.dt.first = 0;
    this.loadVacantes({ first: 0, rows: this.rows });
  }

  onLimpiarClick() {
    const base = this.getDefaultFilters();
    this.filtrosDraft   = { ...base };
    this.filtrosApplied = { ...base };
    this.persistApplied();
    if (this.dt) this.dt.first = 0;
    this.loadVacantes({ first: 0, rows: this.rows });
  }

  // ===== Data (catálogos) =====
  getData = () => {
    this.departamentosLoading = true;
    this.sedesLoading = true;

    this.apiDepartamentos.get().subscribe({
      next: async (resp: TalentFlowResponse) => {
        this.departamentosLoading = false;
        const data: any = resp.data as any;
        this.departamentos = data.data as Departamento[];
      },
      error: (_e: HttpErrorResponse) => {
        this.departamentosLoading = false;
        this.departamentos = [];
      },
    });

    this.apiSedes.get().subscribe({
      next: async (resp: TalentFlowResponse) => {
        this.sedesLoading = false;
        const data: any = resp.data as any;
        this.sedes = data.data as Sede[];
      },
      error: (_e: HttpErrorResponse) => {
        this.sedesLoading = false;
        this.sedes = [];
      },
    });
  };

  // ===== Tabla (lazy) =====
  loadVacantes = (event?: TableLazyLoadEvent) => {
    this.lastLazyState = event ?? this.lastLazyState ?? { first: 0, rows: this.rows };

    const first = this.lastLazyState.first ?? 0;
    const rows  = this.lastLazyState.rows ?? this.rows;

    // sort controlado por la tabla (si vino en el evento, usarlo y persistir)
    const sortField = (this.lastLazyState.sortField as string) ?? this.filtrosApplied.sortBy;
    const sortOrderNum: SortDir =
      typeof this.lastLazyState.sortOrder === 'number'
        ? (this.lastLazyState.sortOrder as SortDir)
        : this.filtrosApplied.sortDir;

    if (this.filtrosApplied.sortBy !== sortField || this.filtrosApplied.sortDir !== sortOrderNum) {
      this.filtrosApplied.sortBy = sortField;
      this.filtrosApplied.sortDir = sortOrderNum;
      this.persistApplied();
    }

    const offset = first;
    const limit  = rows;
    const sortDir = sortOrderNum === 1 ? 'asc' : 'desc';

    this.loading = true;
    this.api.get({
      limit,
      offset,
      filter: this.filtrosApplied.search || null,
      sortBy: sortField,
      sortDir,
      estados: this.filtrosApplied.estados,
      departamentos: this.filtrosApplied.departamentos,
      sedes: this.filtrosApplied.sedes,
    }).subscribe({
      next: (resp: any) => {
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

  // ===== Otros =====
  addOnClose = (_: any) => {
    if (this.dt) this.dt.first = 0;
    this.loadVacantes({ first: 0, rows: this.rows });
    this.addVisible = false;
  };

  goToDetail(v: Vacante) {
    this.router.navigate(['/tf/reclutamiento/vacantes', v.id]);
  }
}
