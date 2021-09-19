import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AuthGuard} from './_helpers';
import {HomeComponent} from './home/home.component';
import {UserListComponent} from './admin/master-data/user-list/user-list.component';
import {LoginLayoutComponent} from './layouts/login-layout/login-layout.component';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';


const routes: Routes = [

  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent  },
  // {
  //   path: 'admin',
  //   canActivate: [AuthGuard],
  //   children: [
  //     { path: 'user-list', component: UserListComponent },
  //   ]
  // },
  {
    path: 'login', component: LoginLayoutComponent, children: [
      { path: '', component: LoginComponent },
    ]
  },
  {
    path: '', component: MainLayoutComponent,canActivate: [AuthGuard], children: [
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'admin/user-list', component: UserListComponent, canActivate: [AuthGuard] },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
