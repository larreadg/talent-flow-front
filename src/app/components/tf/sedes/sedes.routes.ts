import { Routes } from '@angular/router';

export const SEDES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./sedes.component').then((c) => c.SedesComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./sedes-list/sedes-list.component').then((c) => c.SedesListComponent),
      },
      {
        path: 'add',
        loadComponent: () => import('./sedes-add/sedes-add.component').then((c) => c.SedesAddComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./sedes-edit/sedes-edit.component').then((c) => c.SedesEditComponent),
      },
    ],
  },
];
