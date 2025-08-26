import { Component, inject, OnInit } from '@angular/core';
import { bItemUsuariosList } from '../../../utils/breadCrumbItems';
import { environment } from '../../../../environments/environment';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

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

//Services
import { UsuariosService } from '../../../services/usuarios.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-usuarios-list',
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
    RouterLink,
    CommonModule
  ],
  providers: [MessageService],
  templateUrl: './usuarios-list.component.html',
  styleUrl: './usuarios-list.component.scss'
})
export class UsuariosListComponent implements OnInit {
  private toast = inject(MessageService)
  private api = inject(UsuariosService)
  bItems = bItemUsuariosList
  usuarios: any[] = []
  env = environment
  loading: boolean = false

  ngOnInit(): void {
    this.getUsuarios()
  }
  
  getUsuarios() {
    this.loading = true
    this.api.get().subscribe({
      next: async(resp) => {
        const data: any = <any> resp.data;
        this.usuarios = <any[]> data.data
        this.loading = false
      },
      error: (e) => {
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: 'Error al obtener usuarios' });
        this.loading = false
      }
    })
  }
}
