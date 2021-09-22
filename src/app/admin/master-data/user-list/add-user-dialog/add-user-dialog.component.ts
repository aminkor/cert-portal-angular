import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';

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
    'Admin'
  ];

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddUserDialogModel,
    private toastr: ToastrService,
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
    if (this.data.actionType === 'create') {
      this.userRole = 'User';
    }
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
        userRole: this.userRole

      });


    };

    const warn = message => {
      this.toastr.warning(message, '', {
        closeButton: true,
        progressBar: true
      });
    };

    if (this.data.actionType === 'create') {

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
    public buttonDismiss: string = 'Cancel'
  ) {
  }
}
