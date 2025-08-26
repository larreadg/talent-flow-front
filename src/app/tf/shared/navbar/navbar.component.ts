import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { KvStoreService } from '../../../services/kv-store.service';
import { Usuario } from '../../../interfaces/usuario.interface';

// Primeng
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, SidebarModule, PrimeTemplate, RouterLink, AvatarModule, MenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  kv = inject(KvStoreService)
  router = inject(Router)

  items: any[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      route: '/tf/home'
    },
    {
      label: 'Vacantes',
      icon: 'pi pi-briefcase',
      route: '/tf/vacantes'
    },
    {
      label: 'Departamentos',
      icon: 'pi pi-objects-column',
      route: '/tf/departamentos'
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      route: '/tf/usuarios'
    },
    {
      label: 'Sedes',
      icon: 'pi pi-building',
      route: '/tf/sedes'
    },
  ]
  env = environment
  sidebarVisible: boolean = false
  empresaNombre: string = ''
  user: Usuario | any = {}
  userItems: MenuItem[] = [
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => {
        this.cerrarSesion()
      }
    }
  ]

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
}
