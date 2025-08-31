import { Routes } from '@angular/router';

export const TF_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tf.component').then((c) => c.TfComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then((c) => c.HomeComponent),
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.routes').then((m) => m.USUARIOS_ROUTES),
      },
      {
        path: 'vacantes',
        loadChildren: () => import('./vacantes/vacantes.routes').then((m) => m.VACANTES_ROUTES),
      },
      {
        path: 'departamentos',
        loadChildren: () => import('./departamentos/departamentos.routes').then((m) => m.DEPARTAMENTOS_ROUTES),
      },
      {
        path: 'sedes',
        loadChildren: () => import('./sedes/sedes.routes').then((m) => m.SEDES_ROUTES),
      },
    ],
  },
];
