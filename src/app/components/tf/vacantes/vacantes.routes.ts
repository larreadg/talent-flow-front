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
        path: 'add',
        loadComponent: () => import('./vacantes-add/vacantes-add.component').then((c) => c.VacantesAddComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./vacantes-edit/vacantes-edit.component').then((c) => c.VacantesEditComponent),
      },
    ],
  },
];
