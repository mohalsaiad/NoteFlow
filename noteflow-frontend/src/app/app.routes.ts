import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'notes',
    loadComponent: () => import('./components/notes-list/notes-list').then(m => m.NotesListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'notes/:id',
    loadComponent: () => import('./components/note-detail/note-detail').then(m => m.NoteDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'import-export',
    loadComponent: () => import('./components/import-export/import-export').then(m => m.ImportExportComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings').then(m => m.SettingsComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/register'
  }
];
