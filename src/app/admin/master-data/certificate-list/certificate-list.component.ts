import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {CertificateService} from '../../../_services/certificate.service';
import {AddCertificateDialogComponent, AddCertificateDialogModel} from './add-certificate-dialog/add-certificate-dialog.component';
import {DomSanitizer} from '@angular/platform-browser';
import {AccountService} from '../../../_services';


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
    { def: 'created', hide: false },
    { def: 'updated', hide: false },
  ]

  isLoadingResults = false
  noResult = false
  pageSize = 100

  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  constructor(
    private certificateService: CertificateService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {

  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter(cd => !cd.hide).map(cd => cd.def)
  }

  getUserMasterData() {
    this.isLoadingResults = true
    this.noResult = false

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

  onSearch() {
    this.dataSource = new MatTableDataSource([])
    this.getUserMasterData()
  }

  addNewCertificate() {
    const title = `Add Certificate`,
      dialogData = new AddCertificateDialogModel(title),
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
        this.certificateService.delete(item.id).subscribe(
          data => {
            this.onSearch()
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
}
