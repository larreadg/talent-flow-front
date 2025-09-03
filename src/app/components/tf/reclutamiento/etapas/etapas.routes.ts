import { Routes } from '@angular/router';

export const ETAPAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./etapas.component').then((c) => c.EtapasComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./etapas-list/etapas-list.component').then((c) => c.EtapasListComponent),
      }
    ],
  },
];
