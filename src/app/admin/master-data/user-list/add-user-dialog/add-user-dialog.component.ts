import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {AccountService, InstitutionService} from '../../../../_services';
import {MatTableDataSource} from '@angular/material/table';
import {Institution} from '../../../../_models';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {
  dialogTitle: string;
  confirm: string;
  dismiss: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userId;
  userRole: string;
  userRoles = [
    'User',
    'Admin',
    'Instructor'
  ];
  loggedIn = false;
  authenticatedUser;
  isRequireInstitutionId = false;
  institutionId: any;
  institutionsList;
  origin;
  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddUserDialogModel,
    private toastr: ToastrService,
    private accountService: AccountService,
    private institutionService: InstitutionService
  ) {
    this.dialogTitle = data.dialogTitle;
    this.confirm = data.buttonConfirm;
    this.dismiss = data.buttonDismiss;
    this.title = data.item.title;
    this.firstName = data.item.firstName;
    this.lastName = data.item.lastName;
    this.email = data.item.email;
    this.userId = data.item.id;
    this.userRole = data.item.userRole;
    this.origin = data.origin;
    if (this.data.actionType === 'create') {
      this.userRole = 'User';
    }

    this.accountService.user.subscribe(
      (usr) => {
        if (usr) {
          this.loggedIn = true;
          this.authenticatedUser = usr;
          if (this.authenticatedUser.userRole === 'Instructor' && this.origin !== 'user-profile') {

            this.isRequireInstitutionId = true;

            this.userRoles = [
              'User',
            ];


            this.institutionId = data.item.institutionId;

            this.institutionService.getInstructorInstitutions(this.authenticatedUser.id).subscribe(
              (data) => {
                this.institutionsList = data;
              },
              (err) => {
                console.log(err);
              },
              () => {

              }
            );

          }
        }
        else {
          this.loggedIn = false
        }
      }
    );
  }

  ngOnInit(): void {
  }

  onConfirm(actionType): void {
    const submit = () => {

      this.dialogRef.close({
        submit: true,
        title: this.title,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
        acceptTerms: true,
        userRole: this.userRole,
        institutionId: this.institutionId

      });


    };

    const warn = message => {
      this.toastr.warning(message, '', {
        closeButton: true,
        progressBar: true
      });
    };

    if (this.data.actionType === 'create') {

      if (this.isRequireInstitutionId === false) {
        this.title
          ? this.firstName
            ? this.lastName
              ? this.email
                ? this.password
                  ? this.confirmPassword
                    ? submit()
                    : warn('Please provide title')
                  : warn('Please provide first name')
                : warn('Please provide last name')
              : warn('Please provide email')
            : warn('Please provide password')
          : warn('Please provide confirmPassword');
      }
      else {
        this.title
          ? this.firstName
            ? this.lastName
              ? this.email
                ? this.password
                  ? this.confirmPassword
                    ? this.institutionId
                      ? submit()
                    : warn('Please provide title')
                  : warn('Please provide first name')
                : warn('Please provide last name')
              : warn('Please provide email')
            : warn('Please provide password')
          : warn('Please provide confirmPassword')
         : warn('Please provide institution')
      }



    } else if (actionType === 'delete') {
      this.dialogRef.close({
        submit: false,
        actionType
      });
    } else if (this.data.actionType === 'edit') {
      submit();
    }


  }

  onDismiss(): void {
    this.dialogRef.close({
      submit: false
    });
  }


}

export class AddUserDialogModel {
  constructor(
    public dialogTitle: string,
    public item: any = [],
    public actionType: string = 'create',
    public buttonConfirm: string = 'Save',
    public buttonDismiss: string = 'Cancel',
    public origin: string = ''
  ) {
  }
}
