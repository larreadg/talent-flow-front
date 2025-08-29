import { MenuItem } from "primeng/api";

export const bItemHome: MenuItem = { icon: 'pi pi-home', routerLink: '/tf/home' }

export const bItemUsuariosList: MenuItem[] = [bItemHome, { routerLink: '/tf/usuarios', label: 'Usuarios' }]
export const bItemSedesList: MenuItem[] = [bItemHome, { routerLink: '/tf/sedes', label: 'Sedes' }]