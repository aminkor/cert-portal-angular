import {Component, OnInit} from '@angular/core';
import {User} from '../_models';
import {AccountService, BreadcrumbService} from '../_services';
import {AddUserDialogComponent, AddUserDialogModel} from '../admin/master-data/user-list/add-user-dialog/add-user-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  initials: any;
  username: any;
  usermail: any;
  loggedIn = false;
  authenticatedUser: User;
  showChild = false
  userRole: any;
  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private breadcrumbService: BreadcrumbService


  ) {
    this.accountService.user.subscribe(
      (usr) => {
        if (usr) {
          this.loggedIn = true;
          this.authenticatedUser = usr;
          this.username = this.authenticatedUser.firstName + this.authenticatedUser.lastName;
          this.initials = this.getInitials(this.username);
          this.usermail = this.authenticatedUser.email;
          this.userRole = this.authenticatedUser.userRole;
        }
        else {
          this.loggedIn = false
        }
      }
    );
    this.breadcrumbService.changeRootPage('Profile');

  }

  ngOnInit(): void {
  }
  getInitials(name) {
    return name
      .split(' ')
      .slice(0, 2)
      .map(char => char[0])
      .join('')
  }


  editUser() {
    const item = this.authenticatedUser;
    const title = `Edit User`,
      dialogData = new AddUserDialogModel(title, item, 'edit','Save','Cancel', 'user-profile'),
      dialogRef = this.dialog.open(AddUserDialogComponent, {
        maxWidth: '500px',
        width: '500px',
        maxHeight: '500px',
        height: '500px',
        data: dialogData,
        disableClose: true
      })

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.submit) {
        delete dialogResult.submit


        this.accountService.update(item.id, dialogResult).subscribe(
          data => {
            this.authenticatedUser = this.accountService.updateUser(data);
            this.toastr.success('User updated', '', {
              closeButton: true,
              progressBar: true
            })




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
    })

  }
}
