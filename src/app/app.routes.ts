import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  {
    path: 'overview',
    canActivate: [authGuard],
    loadComponent: () => import('./features/overview/overview').then((m) => m.Overview),
  },
  {
    path: 'machine/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/machine-detail/machine-detail').then((m) => m.MachineDetail),
  },
  { path: '**', redirectTo: 'overview' },
];
