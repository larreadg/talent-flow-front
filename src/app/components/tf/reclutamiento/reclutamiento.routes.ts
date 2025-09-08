import { Routes } from '@angular/router';

export const RECLUTAMIENTO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./reclutamiento.component').then((c) => c.ReclutamientoComponent),
    children: [
      {
        path: 'etapas',
        loadChildren: () => import('./etapas/etapas.routes').then((m) => m.ETAPAS_ROUTES),
      },
      {
        path: 'procesos',
        loadChildren: () => import('./procesos/procesos.routes').then((m) => m.PROCESOS_ROUTES),
      },
      {
        path: 'vacantes',
        loadChildren: () => import('./vacantes/vacantes.routes').then((m) => m.VACANTES_ROUTES),
      },
    ],
  },
];
