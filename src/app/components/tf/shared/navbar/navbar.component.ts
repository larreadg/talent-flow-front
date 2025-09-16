import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from "@angular/router";
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
    },
    {
      icon: 'pi pi-star',
      label: 'Reclutamiento',
      expanded: true,
      items: [
        {
          icon: 'pi pi-briefcase',
          routerLink: '/tf/reclutamiento/vacantes',
          label: 'Vacantes', 
        },
        {
          icon: 'pi pi-list-check',
          routerLink: '/tf/reclutamiento/procesos',
          label: 'Procesos', 
        },
        {
          icon: 'pi pi-sort-numeric-down',
          routerLink: '/tf/reclutamiento/etapas',
          label: 'Etapas', 
        },
      ]
    },
    {
      icon: 'pi pi-objects-column',
      routerLink: '/tf/areas',
      label: 'Áreas', 
    },
    {
      icon: 'pi pi-building',
      routerLink: '/tf/sedes',
      label: 'Sedes', 
    },
    {
      icon: 'pi pi-users',
      routerLink: '/tf/usuarios',
      label: 'Usuarios', 
    },
    {
      icon: 'pi pi-calendar-times',
      routerLink: '/tf/dia-no-laboral',
      label: 'Días no laborales', 
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
  panelKey = 0
  iniciales: string = ''

  async ngOnInit() {
    const usuarioRaw = await this.kv.get('user')
    if(usuarioRaw) {
      this.user = JSON.parse(<string> usuarioRaw)
      this.empresaNombre = <string> this.user?.empresa?.nombre
      this.iniciales = `${this.user.nombre.slice(0,1).toUpperCase()}${this.user.apellido.slice(0,1).toUpperCase()}`
    }

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.sidebarVisible = false; // cierra cuando finaliza la navegación
      }
    });
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

  updatePanelKey() {
    this.panelKey++
  }
}
