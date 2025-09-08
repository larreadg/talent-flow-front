import { MenuItem } from "primeng/api";

export const bItemHome: MenuItem = { icon: 'pi pi-home', routerLink: '/tf/home' }

export const bItemUsuariosList: MenuItem[] = [bItemHome, { routerLink: '/tf/usuarios', label: 'Usuarios' }]
export const bItemSedesList: MenuItem[] = [bItemHome, { routerLink: '/tf/sedes', label: 'Sedes' }]
export const bItemDepartamentosList: MenuItem[] = [bItemHome, { routerLink: '/tf/departamentos', label: 'Departamentos' }]
export const bItemDiaNoLaboralList: MenuItem[] = [bItemHome, { routerLink: '/tf/dia-no-laboral', label: 'Días no laborales' }]
export const bItemEtapasList: MenuItem[] = [bItemHome, { routerLink: '/tf/reclutamiento/etapas', label: 'Etapas' }]
export const bItemProcesosList: MenuItem[] = [bItemHome, { routerLink: '/tf/reclutamiento/procesos', label: 'Procesos' }]
export const bItemVacantesList: MenuItem[] = [bItemHome, { routerLink: '/tf/reclutamiento/vacantes', label: 'Vacantes' }]