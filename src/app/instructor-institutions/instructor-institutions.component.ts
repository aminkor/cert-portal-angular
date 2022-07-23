import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AccountService, InstitutionService} from '../_services';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {
  AddInstitutionDialogComponent,
  AddInstitutionDialogModel
} from '../admin/master-data/institution-list/add-institution-dialog/add-institution-dialog.component';

@Component({
  selector: 'app-instructor-institutions',
  templateUrl: './instructor-institutions.component.html',
  styleUrls: ['./instructor-institutions.component.scss']
})
export class InstructorInstitutionsComponent implements OnInit {
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

  private loggedIn: boolean;
  authenticatedUser
  constructor(
    private institutionService: InstitutionService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private accountService: AccountService,

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

    this.institutionService.getInstructorInstitutions(this.authenticatedUser.id).subscribe(
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

  viewStudents(institutionId) {
    // navigate to students list
    this.router.navigate(['students-list'], { queryParams: { institutionId }});

  }

  viewCertificates(institutionId) {
    // navigate to certificates list
    this.router.navigate(['admin/certificate-list'], { queryParams: { institutionId, byInstitution: true }});
  }
}

