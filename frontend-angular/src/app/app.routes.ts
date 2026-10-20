import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { BusinessSettingsComponent } from './pages/business-settings/business-settings.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ProductsComponent } from './pages/products/products.component';
import { ThemesComponent } from './pages/themes/themes.component';
import { QrManagementComponent } from './pages/qr/qr-management.component';
import { SubscriptionComponent } from './pages/subscription/subscription.component';
import { AdminPanelComponent } from './pages/admin/admin-panel.component';
import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: OverviewComponent },
      { path: 'business', component: BusinessSettingsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'themes', component: ThemesComponent },
      { path: 'qr', component: QrManagementComponent },
      { path: 'subscription', component: SubscriptionComponent },
    ],
  },
  {
    path: 'admin',
    component: DashboardLayoutComponent,
    canActivate: [adminGuard],
    children: [{ path: '', component: AdminPanelComponent }],
  },
  { path: '**', redirectTo: 'dashboard' },
];
