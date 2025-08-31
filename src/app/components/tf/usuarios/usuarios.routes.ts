import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./usuarios.component').then((c) => c.UsuariosComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./usuarios-list/usuarios-list.component').then((c) => c.UsuariosListComponent),
      },
      {
        path: 'add',
        loadComponent: () => import('./usuarios-add/usuarios-add.component').then((c) => c.UsuariosAddComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./usuarios-edit/usuarios-edit.component').then((c) => c.UsuariosEditComponent),
      },
    ],
  },
];
