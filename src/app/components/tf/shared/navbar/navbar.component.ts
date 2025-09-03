import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { KvStoreService } from '../../../../services/kv-store.service';
import { Usuario } from '../../../../interfaces/usuario.interface';

// Primeng
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { MenuItem, MessageService, PrimeTemplate } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { UpdatePassComponent } from '../update-pass/update-pass.component';
import { ToastModule } from 'primeng/toast';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    SidebarModule,
    AvatarModule,
    MenuModule,
    DialogModule,
    ToastModule,
    PrimeTemplate,
    UpdatePassComponent,
    PanelMenuModule
  ],
  providers: [MessageService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  kv = inject(KvStoreService)
  router = inject(Router)
  items: MenuItem[] = [
    {
      icon: 'pi pi-home',
      routerLink: '/tf/home',
      label: 'Inicio', 
      command: () => {
        this.toggleSidebar()
      }
    },
    {
      icon: 'pi pi-star',
      label: 'Reclutamiento',
      expanded: true,
      items: [
        {
          icon: 'pi pi-briefcase',
          routerLink: '/tf/reclutamiento/etapas',
          label: 'Vacantes', 
          command: () => {
            this.toggleSidebar()
          }
        },
        {
          icon: 'pi pi-list-check',
          routerLink: '/tf/reclutamiento/procesos',
          label: 'Procesos', 
          command: () => {
            this.toggleSidebar()
          }
        },
        {
          icon: 'pi pi-sort-numeric-down',
          routerLink: '/tf/reclutamiento/etapas',
          label: 'Etapas', 
          command: () => {
            this.toggleSidebar()
          }
        },
      ]
    },
    {
      icon: 'pi pi-objects-column',
      routerLink: '/tf/departamentos',
      label: 'Departamentos', 
      command: () => {
        this.toggleSidebar()
      }
    },
    {
      icon: 'pi pi-building',
      routerLink: '/tf/sedes',
      label: 'Sedes', 
      command: () => {
        this.toggleSidebar()
      }
    },
    {
      icon: 'pi pi-users',
      routerLink: '/tf/usuarios',
      label: 'Usuarios', 
      command: () => {
        this.toggleSidebar()
      }
    },
    {
      icon: 'pi pi-calendar-times',
      routerLink: '/tf/dia-no-laboral',
      label: 'Días no laborales', 
      command: () => {
        this.toggleSidebar()
      }
    },
  ]
  env = environment
  sidebarVisible: boolean = false
  empresaNombre: string = ''
  user: Usuario | any = {}
  userItems: MenuItem[] = [
    {
      label: 'Cambiar contraseña',
      icon: 'pi pi-lock',
      command: () => {
        this.updatePassVisible = true
      }
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => {
        this.cerrarSesion()
      }
    },
  ]
  updatePassVisible: boolean = false

  async ngOnInit() {
    const usuarioRaw = await this.kv.get('user')
    if(usuarioRaw) {
      this.user = JSON.parse(<string> usuarioRaw)
      this.empresaNombre = <string> this.user?.empresa?.nombre
    }
  }

  toggleSidebar = () => {
    this.sidebarVisible = !this.sidebarVisible
  }

  cerrarSesion = async() => {
    await this.kv.del('token')
    await this.kv.del('user')
    this.router.navigate(['/auth/login'])
  }

  updatePassClose = (_:any) => {
    this.updatePassVisible = false
  }
}
