import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {ToastrModule} from 'ngx-toastr';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DatePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {ErrorInterceptor} from './_helpers';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './admin/master-data/user-list/user-list.component';
import {AdminComponent} from './admin/admin.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatProgressSpinnerModule, MatSpinner} from '@angular/material/progress-spinner';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddUserDialogComponent } from './admin/master-data/user-list/add-user-dialog/add-user-dialog.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { InstitutionListComponent } from './admin/master-data/institution-list/institution-list.component';
// tslint:disable-next-line:max-line-length
import { AddInstitutionDialogComponent } from './admin/master-data/institution-list/add-institution-dialog/add-institution-dialog.component';
import { CertificateListComponent } from './admin/master-data/certificate-list/certificate-list.component';
// tslint:disable-next-line:max-line-length
import { AddCertificateDialogComponent } from './admin/master-data/certificate-list/add-certificate-dialog/add-certificate-dialog.component';
import { StudentsListComponent } from './admin/master-data/students-list/students-list.component';
import { AddStudentDialogComponent } from './admin/master-data/students-list/add-student-dialog/add-student-dialog.component';
import {
  AssignInstitutionsDialogComponent,
  EditInstitutionsDialogComponent
} from './admin/master-data/user-list/edit-institutions-dialog/edit-institutions-dialog.component';
import {MatChipsModule} from '@angular/material/chips';
import { UserCertificatesComponent } from './user-certificates/user-certificates.component';
import { InstructorInstitutionsComponent } from './instructor-institutions/instructor-institutions.component';
import { AssignCertInstitutionComponent } from './assign-cert-institution/assign-cert-institution.component';
import { AssignCertStudentComponent } from './assign-cert-student/assign-cert-student.component';
import { InstructorStudentsComponent } from './instructor-students/instructor-students.component';
import { InstructorCertificatesComponent } from './instructor-certificates/instructor-certificates.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { GenerateCertificateDialogComponent } from './admin/master-data/certificate-list/generate-certificate-dialog/generate-certificate-dialog.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ViewPdfComponent } from './view-pdf/view-pdf.component';
import { BreadcrumbService } from './_services';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AdminComponent,
    UserListComponent,
    AddUserDialogComponent,
    LoginLayoutComponent,
    MainLayoutComponent,
    InstitutionListComponent,
    AddInstitutionDialogComponent,
    CertificateListComponent,
    AddCertificateDialogComponent,
    StudentsListComponent,
    AddStudentDialogComponent,
    EditInstitutionsDialogComponent,
    AssignInstitutionsDialogComponent,
    UserCertificatesComponent,
    InstructorInstitutionsComponent,
    AssignCertInstitutionComponent,
    AssignCertStudentComponent,
    InstructorStudentsComponent,
    InstructorCertificatesComponent,
    UserProfileComponent,
    GenerateCertificateDialogComponent,
    ViewPdfComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    ToastrModule.forRoot(), // ToastrModule added
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatListModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatChipsModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatSelectSearchModule,
    PdfViewerModule

  ],
  providers: [
    HttpClient,
    DatePipe,
    MatDialog,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    MatDatepickerModule,
    BreadcrumbService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
