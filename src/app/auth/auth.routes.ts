import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth.component').then((c) => c.AuthComponent),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent),
      },
      {
        path: 'activate-account',
        loadComponent: () => import('./activate-account/activate-account.component').then((c) => c.ActivateAccountComponent),
      },
      {
        path: 'reset-account',
        loadComponent: () => import('./reset-account/reset-account.component').then((c) => c.ResetAccountComponent),
      },
    ],
  },
];
