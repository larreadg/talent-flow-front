import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'tf',
    canActivateChild: [authGuard],
    loadChildren: () => import('./components/tf/tf.routes').then((m) => m.TF_ROUTES),
  },
  { path: '', redirectTo: 'tf', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
];
