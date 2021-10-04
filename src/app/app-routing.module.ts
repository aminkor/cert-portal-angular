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
import {InstitutionListComponent} from './admin/master-data/institution-list/institution-list.component';
import {CertificateListComponent} from './admin/master-data/certificate-list/certificate-list.component';
import {StudentsListComponent} from './admin/master-data/students-list/students-list.component';
import {UserCertificatesComponent} from './user-certificates/user-certificates.component';
import {InstructorInstitutionsComponent} from './instructor-institutions/instructor-institutions.component';


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
    path: 'register', component: LoginLayoutComponent, children: [
      { path: '', component: RegisterComponent },
    ]
  },
  {
    path: '', component: MainLayoutComponent,canActivate: [AuthGuard], children: [
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'admin/user-list', component: UserListComponent, canActivate: [AuthGuard] },
      { path: 'admin/institution-list', component: InstitutionListComponent, canActivate: [AuthGuard] },
      { path: 'admin/certificate-list', component: CertificateListComponent, canActivate: [AuthGuard] },
      { path: 'students-list', component: StudentsListComponent, canActivate: [AuthGuard] },
      { path: 'user-certificates', component: UserCertificatesComponent, canActivate: [AuthGuard] },
      { path: 'instructor-institutions', component: InstructorInstitutionsComponent, canActivate: [AuthGuard] },

      { path: '**', redirectTo: 'home' }

    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
