import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./usuarios.component').then((c) => c.UsuariosComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./usuarios-list/usuarios-list.component').then((c) => c.UsuariosListComponent),
      }
    ],
  },
];
