import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CvComponent } from './pages/cv/cv.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { allowedGuard } from './guards/allowed.guard';
import { ownerGuard } from './guards/owner.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'cv', component: CvComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [allowedGuard] },
  {
    path: 'dashboard/economic',
    loadComponent: () =>
      import('./pages/dashboard/economic/economic.component').then((m) => m.EconomicComponent),
    canActivate: [allowedGuard]
  },
  {
    path: 'dashboard/admin',
    loadComponent: () =>
      import('./pages/dashboard/admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [ownerGuard]
  },
  { path: '**', redirectTo: '' }
];
