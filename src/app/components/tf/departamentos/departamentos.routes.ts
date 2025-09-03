import { Routes } from '@angular/router';

export const DEPARTAMENTOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./departamentos.component').then((c) => c.DepartamentosComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./departamentos-list/departamentos-list.component').then((c) => c.DepartamentosListComponent),
      }
    ],
  },
];
