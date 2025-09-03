import { Routes } from '@angular/router';

export const DIA_NO_LABORAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dia-no-laboral.component').then((c) => c.DiaNoLaboralComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./dia-no-laboral-list/dia-no-laboral-list.component').then((c) => c.DiaNoLaboralListComponent),
      }
    ],
  },
];
