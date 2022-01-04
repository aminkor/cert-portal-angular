import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {CertificateService} from '../../../_services/certificate.service';
import {AddCertificateDialogComponent, AddCertificateDialogModel} from './add-certificate-dialog/add-certificate-dialog.component';
import {DomSanitizer} from '@angular/platform-browser';
import {AccountService, InstitutionService} from '../../../_services';
import {ActivatedRoute, Router} from '@angular/router';
import {Certificate, Institution} from '../../../_models';
import {
  AssignCertInstitutionComponent,
  AssignCertInstitutionModel
} from '../../../assign-cert-institution/assign-cert-institution.component';
import {AssignCertStudentComponent, AssignCertStudentModel} from '../../../assign-cert-student/assign-cert-student.component';
import { Location } from '@angular/common'
import {
  GenerateCertificateDialogComponent,
  GenerateCertificateDialogModel
} from './generate-certificate-dialog/generate-certificate-dialog.component';
import { ViewPdfComponent, ViewPdfModel } from 'src/app/view-pdf/view-pdf.component';

@Component({
  selector: 'app-certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: ['./certificate-list.component.scss']
})
export class CertificateListComponent implements OnInit {
  columnDefinitions = [
    { def: 'id', hide: false },
    { def: 'name', hide: false },
    { def: 'description', hide: false },
    { def: 'url', hide: false },
    { def: 'view', hide: false },
    { def: 'issuedBy', hide: false },
    { def: 'assignedTo', hide: false },
    { def: 'created', hide: false },
    { def: 'updated', hide: false },
  ]

  isLoadingResults = false
  noResult = false
  pageSize = 100

  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  private selectedInstitution: Institution;
  byInstitution = false;
  pageTitle: any = 'Manage Certificates';
  authenticatedUser: any;

  constructor(
    private certificateService: CertificateService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private institutionService: InstitutionService,
    private location: Location,
    private accountService: AccountService
  ) {

    this.accountService.user.subscribe(
      (usr) => {
        if (usr) {
          this.authenticatedUser = usr;

        }
        else {

        }
      }
    );

  }

  ngOnInit(): void {
    this.byInstitution = this.route.snapshot.queryParamMap.get('byInstitution') === 'true';
    const paramsInstitutionId = this.route.snapshot.queryParamMap.get('institutionId');
    if (this.byInstitution && paramsInstitutionId) {
      this.getInstitution(paramsInstitutionId);
    }
    else {
      this.onSearch(this.byInstitution);
    }
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter(cd => !cd.hide).map(cd => cd.def)
  }

  getUserMasterData(byInstitution = false) {
    this.isLoadingResults = true
    this.noResult = false

    if (byInstitution === false) {
      this.certificateService.getAll().subscribe(
        data => {
          this.dataSource = new MatTableDataSource(data)
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
          this.isLoadingResults = false
          this.noResult = data.length > 0 ? false : true
        },
        error => {
          this.noResult = true
          console.log(error)
        }
      )
    }
    else {
      this.certificateService.getAllByInstitution(this.selectedInstitution).subscribe(
        data => {
          this.dataSource = new MatTableDataSource(data)
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
          this.isLoadingResults = false
          this.noResult = data.length > 0 ? false : true
        },
        error => {
          this.noResult = true
          console.log(error)
        }
      )
    }

  }

  onSearch(byInstitution) {
    this.dataSource = new MatTableDataSource([])
    this.getUserMasterData(byInstitution)
  }

  addNewCertificate() {
    let title = `Add Certificate`;
    if (this.byInstitution) {
      title = `Add Certificate for ${this.selectedInstitution.name}`
    }
    const
      dialogData = new AddCertificateDialogModel(title,{
        byInstitution: this.byInstitution,
        selectedInstitution: this.selectedInstitution
      }),
      dialogRef = this.dialog.open(AddCertificateDialogComponent, {
        maxWidth: '500px',
        width: '500px',
        data: dialogData,
        disableClose: true
      })

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.submit) {
        delete dialogResult.submit
        // TODO will change roles to actual array of roles id
        // dialogResult.roles = []

        this.certificateService.create(dialogResult, dialogResult.file).subscribe(
          data => {
            this.toastr.success('Certificate added', '', {
              closeButton: true,
              progressBar: true
            })


            this.onSearch(this.byInstitution);


          },
          error => {
            this.toastr.error(`${error}`, 'Failed to add', {
              closeButton: true,
              progressBar: true,
              extendedTimeOut: 5000
            })
          },
          () => {
          }
        )
      }

    })
  }

  editRow(item) {
    const title = `Edit Certificate`,
      dialogData = new AddCertificateDialogModel(title, item, 'edit'),
      dialogRef = this.dialog.open(AddCertificateDialogComponent, {
        maxWidth: '500px',
        width: '500px',
        data: dialogData,
        disableClose: true
      })

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.submit) {
        delete dialogResult.submit


        this.certificateService.update(item.id, dialogResult, dialogResult.file).subscribe(
          data => {
            this.toastr.success('Certificate updated', '', {
              closeButton: true,
              progressBar: true
            })

            this.onSearch(this.byInstitution);


          },
          error => {
            this.toastr.error(`${error}`, 'Failed to update', {
              closeButton: true,
              progressBar: true,
              extendedTimeOut: 5000
            })
          },
          () => {
          }
        )
      }
      else if (dialogResult.actionType === 'delete') {
        this.certificateService.delete(item.id).subscribe(
          data => {
            this.onSearch(this.byInstitution)
            this.toastr.success('Certificate deleted', '', {
              closeButton: true,
              progressBar: true
            })
          },
          error => {
            this.toastr.error(`${error}`, 'Failed to delete', {
              closeButton: true,
              progressBar: true,
              extendedTimeOut: 5000
            })
          }
        )
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  makeItSafe(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goToLink(url) {
    window.open(url, '_blank');
  }

  private getInstitution(paramsInstitutionId) {
    this.institutionService.getById(paramsInstitutionId).subscribe(
      (data) => {
        if (data) {
          this.selectedInstitution = data;
          this.pageTitle = 'Manage Institution Certificates for ' + data.name;
          this.onSearch(this.byInstitution)

        }
      },
      (err) => {
        console.log(err);
      },
      () => {

      }
    );
  }

  assignInstitution(certificate: Certificate) {

    let actionType;
    if (this.authenticatedUser.userRole === 'Instructor') {
      actionType = 'instructor-assign-institutiont'
    }
    const title = `Assign Institution`,
      dialogData = new AssignCertInstitutionModel(title, certificate, actionType),
      dialogRef = this.dialog.open(AssignCertInstitutionComponent, {
        maxWidth: '500px',
        width: '500px',
        data: dialogData,
        disableClose: true
      })

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.submit) {
        delete dialogResult.submit
        // TODO will change roles to actual array of roles id
        // dialogResult.roles = []

        this.certificateService.update(certificate.id,{institutionId: dialogResult.institutionId},null).subscribe(
          data => {
            this.toastr.success('Institution assigned', '', {
              closeButton: true,
              progressBar: true
            })
            this.onSearch(this.byInstitution);

          },
          error => {
            this.toastr.error(`${error}`, 'Failed to assign', {
              closeButton: true,
              progressBar: true,
              extendedTimeOut: 5000
            })
          },
          () => {
          }
        )
      }

    })

  }

  assignStudent(certificate: Certificate) {
    let actionType;
    if (this.authenticatedUser.userRole === 'Instructor') {
      actionType = 'instructor-assign-student'
    }
    if (certificate.institutionId != null && certificate.institutionId !== 0) {
      const title = `Assign Student`,
        dialogData = new AssignCertStudentModel(title, certificate, actionType,'Save','Cancel',certificate),
        dialogRef = this.dialog.open(AssignCertStudentComponent, {
          maxWidth: '500px',
          width: '500px',
          data: dialogData,
          disableClose: true
        })

      dialogRef.afterClosed().subscribe(
        (data) => {
          this.onSearch(this.byInstitution);
        }
      )
    }
    else {
      this.toastr.warning('Please assign an institution first');
    }
  }
  unassignStudent(certificate: Certificate) {
    let actionType;
    if (this.authenticatedUser.userRole === 'Instructor') {
      actionType = 'instructor-unassign-student'
    }
    this.certificateService.update(certificate.id, {accountId: 0, actionType},null).subscribe(
      (data) => {
        this.toastr.success('Success', 'Student Unassigned');
        this.onSearch(this.byInstitution);
      },
      (err) => {
        this.toastr.error('Error', err);

      },
      () => {

      }
    );
  }

  unassignInstitution(certificate: Certificate) {
    let actionType;
    if (this.authenticatedUser.userRole === 'Instructor') {
      actionType = 'instructor-unassign-institution'
    }
    this.certificateService.update(certificate.id,{institutionId: 0, actionType},null).subscribe(
      data => {
        this.toastr.success('Institution unassigned', '', {
          closeButton: true,
          progressBar: true
        })
        this.onSearch(this.byInstitution);

      },
      error => {
        this.toastr.error(`${error}`, 'Failed to unassign', {
          closeButton: true,
          progressBar: true,
          extendedTimeOut: 5000
        })
      },
      () => {
      }
    )
  }

  close() {
    this.location.back();
  }

  generateFromTemplate() {
    let title = `Generate Certificate`;
    if (this.byInstitution) {
      title = `Generate Certificate for ${this.selectedInstitution.name}`
    }
    const
      dialogData = new GenerateCertificateDialogModel(title,{
        byInstitution: this.byInstitution,
        selectedInstitution: this.selectedInstitution
      }),
      dialogRef = this.dialog.open(GenerateCertificateDialogComponent, {
        maxWidth: '500px',
        width: '500px',
        data: dialogData,
        disableClose: true
      })

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.submit) {
        delete dialogResult.submit
        // TODO will change roles to actual array of roles id
        // dialogResult.roles = []

        this.certificateService.generate(dialogResult).subscribe(
          data => {
            this.toastr.success('Certificates generated', '', {
              closeButton: true,
              progressBar: true
            })


            this.onSearch(this.byInstitution);


          },
          error => {
            this.toastr.error(`${error}`, 'Failed to generate', {
              closeButton: true,
              progressBar: true,
              extendedTimeOut: 5000
            })
          },
          () => {
          }
        )
      }

    })
  }

  viewPdf(url) {
    const title = `Assign Student`,
    dialogData = new ViewPdfModel(url),
    dialogRef = this.dialog.open(ViewPdfComponent, {
      maxWidth: '500px',
      width: '500px',
      data: dialogData,
      disableClose: false
    })
  }
}
