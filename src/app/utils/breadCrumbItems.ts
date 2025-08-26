import { MenuItem } from "primeng/api";

export const bItemHome: MenuItem = { icon: 'pi pi-home', routerLink: '/tf/home' }

export const bItemUsuariosList: MenuItem[] = [bItemHome, { routerLink: '/tf/usuarios', label: 'Usuarios' }]
export const bItemUsuariosAdd: MenuItem[] = [bItemHome, { routerLink: '/tf/usuarios', label: 'Usuarios' }, { label: 'Agregar' }]
export const bItemUsuariosEdit: MenuItem[] = [bItemHome, { routerLink: '/tf/usuarios', label: 'Usuarios' }, { label: 'Editar' }]