import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-add-institution-dialog',
  templateUrl: './add-institution-dialog.component.html',
  styleUrls: ['./add-institution-dialog.component.scss']
})
export class AddInstitutionDialogComponent implements OnInit {
  dialogTitle: string;
  confirm: string;
  dismiss: string;
  name: string;
  description: string;
  address: string;

  constructor(
    public dialogRef: MatDialogRef<AddInstitutionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddInstitutionDialogModel,
    private toastr: ToastrService,
  ) {
    this.dialogTitle = data.dialogTitle;
    this.confirm = data.buttonConfirm;
    this.dismiss = data.buttonDismiss;
    this.name = data.item.name;
    this.description = data.item.description;
    this.address = data.item.address;
  }

  ngOnInit(): void {
  }

  onConfirm(actionType): void {
    const submit = () => {

      this.dialogRef.close({
        submit: true,
        name: this.name,
        description: this.description,
        address: this.address,

      });


    };

    const warn = message => {
      this.toastr.warning(message, '', {
        closeButton: true,
        progressBar: true
      });
    };

    if (this.data.actionType === 'create') {

      this.name
        ? submit()
        : warn('Please provide name');


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

export class AddInstitutionDialogModel {
  constructor(
    public dialogTitle: string,
    public item: any = [],
    public actionType: string = 'create',
    public buttonConfirm: string = 'Save',
    public buttonDismiss: string = 'Cancel'
  ) {
  }
}
