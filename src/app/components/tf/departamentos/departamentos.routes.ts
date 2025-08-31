import { Routes } from '@angular/router';

export const DEPARTAMENTOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./departamentos.component').then((c) => c.DepartamentosComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./departamentos-list/departamentos-list.component').then((c) => c.DepartamentosListComponent),
      },
      {
        path: 'add',
        loadComponent: () => import('./departamentos-add/departamentos-add.component').then((c) => c.DepartamentosAddComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./departamentos-edit/departamentos-edit.component').then((c) => c.DepartamentosEditComponent),
      },
    ],
  },
];
