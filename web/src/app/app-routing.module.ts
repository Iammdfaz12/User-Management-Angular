import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './modules/login-page/login-page.component';
import { UserManagementDashboardComponent } from './modules/user-management-dashboard/user-management-dashboard.component';
import { AddNewUserComponent } from './modules/add-new-user/add-new-user.component';
import { RegisterPageComponent } from './modules/register-page/register-page.component';
import { AuthGuard } from './services/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  // {
  //   path: 'register',
  //   component: RegisterPageComponent,
  // },
  {
    path: 'user-management-dashboard',
    component: UserManagementDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-new-user',
    component: AddNewUserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
