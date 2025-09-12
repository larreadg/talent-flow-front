import { Routes } from '@angular/router';

export const VACANTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./vacantes.component').then((c) => c.VacantesComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./vacantes-list/vacantes-list.component').then((c) => c.VacantesListComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('./vacantes-detail/vacantes-detail.component').then((c) => c.VacantesDetailComponent),
      },
    ],
  },
];
