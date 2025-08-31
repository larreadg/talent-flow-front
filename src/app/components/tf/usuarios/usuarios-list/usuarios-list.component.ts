import { Component, inject, OnInit } from '@angular/core';
import { bItemUsuariosList } from '../../../../utils/breadCrumbItems';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../../interfaces/usuario.interface';

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

//Services
import { UsuariosService } from '../../../../services/usuarios.service';
import { MessageService } from 'primeng/api';
import { KvStoreService } from '../../../../services/kv-store.service';

//Components
import { UsuariosAddComponent } from '../usuarios-add/usuarios-add.component';
import { UsuariosEditComponent } from '../usuarios-edit/usuarios-edit.component';


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
    DialogModule,
    CommonModule,
    UsuariosAddComponent,
    UsuariosEditComponent
  ],
  providers: [MessageService],
  templateUrl: './usuarios-list.component.html',
  styleUrl: './usuarios-list.component.scss'
})
export class UsuariosListComponent implements OnInit {
  private toast = inject(MessageService)
  private api = inject(UsuariosService)
  private kv = inject(KvStoreService)
  bItems = bItemUsuariosList
  usuarios: Usuario[] = []
  env = environment
  loading: boolean = false
  currentUser!: Usuario
  addVisible: boolean = false
  editVisible: boolean = false
  editUsuario!: Usuario

  async ngOnInit() {
    let data: string = <string> await this.kv.get('user')
    this.currentUser = <Usuario> JSON.parse(data)
    this.getUsuarios()
  }
  
  getUsuarios() {
    this.loading = true
    this.api.get().subscribe({
      next: async(resp) => {
        const data: any = <any> resp.data;
        this.usuarios = <Usuario[]> data.data
        this.loading = false
      },
      error: (e) => {
        this.toast.add({ severity: 'error', summary: this.env.appName, detail: 'Error al obtener usuarios' });
        this.loading = false
      }
    })
  }

  editOpenModal = (u:any) => {
    this.editUsuario = <Usuario> u
    this.editVisible = true
  }

  editOnClose = (_:any) => {
    this.getUsuarios()
    this.editVisible = false
  }
  
  addOnClose = (_:any) => {
    this.getUsuarios()
    this.addVisible = false
  }
}
