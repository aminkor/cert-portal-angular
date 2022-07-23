import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AccountService} from '../_services';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {AddUserDialogComponent, AddUserDialogModel} from '../admin/master-data/user-list/add-user-dialog/add-user-dialog.component';
import {User} from '../_models';
import {
  EditInstitutionsDialogComponent,
  EditInstitutionsDialogModel
} from '../admin/master-data/user-list/edit-institutions-dialog/edit-institutions-dialog.component';

@Component({
  selector: 'app-instructor-students',
  templateUrl: './instructor-students.component.html',
  styleUrls: ['./instructor-students.component.scss']
})
export class InstructorStudentsComponent implements OnInit {
  columnDefinitions = [
    { def: 'id', hide: false },
    { def: 'firstName', hide: false },
    { def: 'lastName', hide: false },
    { def: 'email', hide: false },
    { def: 'userRole', hide: false },
    { def: 'isVerified', hide: false },
    { def: 'created', hide: true },
    { def: 'updated', hide: true },
    { def: 'registeredTo', hide: false}
  ]

  isLoadingResults = false
  noResult = false
  pageSize = 100

  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  loggedIn = false;
  authenticatedUser;
  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private toastr: ToastrService,
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
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter(cd => !cd.hide).map(cd => cd.def)
  }

  getUserMasterData() {
    this.isLoadingResults = true
    this.noResult = false

    this.accountService.getInstructorStudents(this.authenticatedUser.id).subscribe(
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


  addNewUser() {
    const title = `Add User`,
      dialogData = new AddUserDialogModel(title),
      dialogRef = this.dialog.open(AddUserDialogComponent, {
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

        this.accountService.create(dialogResult).subscribe(
          data => {
            this.toastr.success('User added', '', {
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
    const title = `Edit User`,
      dialogData = new AddUserDialogModel(title, item, 'edit'),
      dialogRef = this.dialog.open(AddUserDialogComponent, {
        maxWidth: '500px',
        width: '500px',
        data: dialogData,
        disableClose: true
      })

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.submit) {
        delete dialogResult.submit


        this.accountService.update(item.id, dialogResult).subscribe(
          data => {
            this.toastr.success('User updated', '', {
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
        this.accountService.delete(item.id).subscribe(
          data => {
            this.onSearch()
            this.toastr.success('User deleted', '', {
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

  editInstitutions(account: User) {
    const title = `Edit Institutions`,
      dialogData = new EditInstitutionsDialogModel(title,account,),
      dialogRef = this.dialog.open(EditInstitutionsDialogComponent, {
        maxWidth: '500px',
        width: '500px',
        data: dialogData,
        disableClose: true
      })
  }
}
