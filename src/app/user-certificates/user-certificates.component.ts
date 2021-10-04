import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CertificateService} from '../_services/certificate.service';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {DomSanitizer} from '@angular/platform-browser';
import {
  AddCertificateDialogComponent,
  AddCertificateDialogModel
} from '../admin/master-data/certificate-list/add-certificate-dialog/add-certificate-dialog.component';
import {AccountService} from '../_services';

@Component({
  selector: 'app-user-certificates',
  templateUrl: './user-certificates.component.html',
  styleUrls: ['./user-certificates.component.scss']
})
export class UserCertificatesComponent implements OnInit {
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

  private loggedIn: boolean;
  authenticatedUser
  constructor(
    private certificateService: CertificateService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private accountService: AccountService,
    public sanitizer: DomSanitizer

  ) {
    this.accountService.user.subscribe(
      (usr) => {
        if (usr) {
          this.loggedIn = true;
          this.authenticatedUser = usr;
          this.onSearch()

        }
        else {
          this.loggedIn = false
        }
      }
    );
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

    this.certificateService.getUserCertificates(this.authenticatedUser.id).subscribe(
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


  editRow(item) {

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

