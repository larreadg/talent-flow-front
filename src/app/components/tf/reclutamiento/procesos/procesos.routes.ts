import { Routes } from '@angular/router';

export const PROCESOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./procesos.component').then((c) => c.ProcesosComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./procesos-list/procesos-list.component').then((c) => c.ProcesosListComponent),
      }
    ],
  },
];
