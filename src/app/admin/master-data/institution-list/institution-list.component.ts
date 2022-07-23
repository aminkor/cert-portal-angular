import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {AddInstitutionDialogComponent, AddInstitutionDialogModel} from './add-institution-dialog/add-institution-dialog.component';
import {BreadcrumbService, InstitutionService} from '../../../_services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-institution-list',
  templateUrl: './institution-list.component.html',
  styleUrls: ['./institution-list.component.scss']
})
export class InstitutionListComponent implements OnInit {
  columnDefinitions = [
    { def: 'id', hide: false },
    { def: 'name', hide: false },
    { def: 'description', hide: false },
    { def: 'address', hide: false },
    { def: 'students', hide: false },
    { def: 'studentsCounts', hide: false },
    { def: 'certificates', hide: false },
    { def: 'certificatesCounts', hide: false },
    { def: 'created', hide: true },
    { def: 'updated', hide: true },
  ]

  isLoadingResults = false
  noResult = false
  pageSize = 100

  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  pageTitle: any = 'Manage Institution';
  constructor(
    private institutionService: InstitutionService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private breadcrumbService: BreadcrumbService

  ) {
    this.breadcrumbService.changeRootPage('Institution List');

  }

  ngOnInit(): void {
    this.onSearch()

  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter(cd => !cd.hide).map(cd => cd.def)
  }

  getUserMasterData() {
    this.isLoadingResults = true
    this.noResult = false

    this.institutionService.getAll().subscribe(
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

  onSearch() {
    this.dataSource = new MatTableDataSource([])
    this.getUserMasterData()
  }

  addNewInstitution() {
    const title = `Add Institution`,
      dialogData = new AddInstitutionDialogModel(title),
      dialogRef = this.dialog.open(AddInstitutionDialogComponent, {
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

        this.institutionService.create(dialogResult).subscribe(
          data => {
            this.toastr.success('Institution added', '', {
              closeButton: true,
              progressBar: true
            })

            this.onSearch();


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
    const title = `Edit Institution`,
      dialogData = new AddInstitutionDialogModel(title, item, 'edit'),
      dialogRef = this.dialog.open(AddInstitutionDialogComponent, {
        maxWidth: '500px',
        width: '500px',
        data: dialogData,
        disableClose: true
      })

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.submit) {
        delete dialogResult.submit


        this.institutionService.update(item.id, dialogResult).subscribe(
          data => {
            this.toastr.success('Institution updated', '', {
              closeButton: true,
              progressBar: true
            })

            this.onSearch();


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
        this.institutionService.delete(item.id).subscribe(
          data => {
            this.onSearch()
            this.toastr.success('Institution deleted', '', {
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

  viewStudents(institutionId) {
    // navigate to students list
    this.router.navigate(['students-list'], { queryParams: { institutionId }});

  }

  viewCertificates(institutionId) {
    // navigate to certificates list
    this.router.navigate(['admin/certificate-list'], { queryParams: { institutionId, byInstitution: true }});

  }
}
