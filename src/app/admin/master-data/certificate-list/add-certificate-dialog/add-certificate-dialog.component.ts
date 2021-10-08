import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {AccountService, InstitutionService} from '../../../../_services';

@Component({
  selector: 'app-add-certificate-dialog',
  templateUrl: './add-certificate-dialog.component.html',
  styleUrls: ['./add-certificate-dialog.component.scss']
})
export class AddCertificateDialogComponent implements OnInit {
  dialogTitle: string;
  confirm: string;
  dismiss: string;
  name: string;
  description: string;
  address: string;
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  byInstitution;
  selectedInstitution;
  authenticatedUser;
  isRequireInstitutionId = false;
  institutionId: any;
  institutionsList;

  constructor(
    public dialogRef: MatDialogRef<AddCertificateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddCertificateDialogModel,
    private toastr: ToastrService,
    private accountService: AccountService,
    private institutionService: InstitutionService


  ) {
    this.dialogTitle = data.dialogTitle;
    this.confirm = data.buttonConfirm;
    this.dismiss = data.buttonDismiss;
    this.name = data.item.name;
    this.description = data.item.description;
    this.byInstitution = data.item.byInstitution;
    this.selectedInstitution = data.item.selectedInstitution;

    this.accountService.user.subscribe(
      (usr) => {
        if (usr) {
          this.authenticatedUser = usr;
          if (this.authenticatedUser.userRole === 'Instructor' && this.selectedInstitution == null) {
            this.isRequireInstitutionId = true;
            this.initInstitutions();

          }

        }
        else {

        }
      }
    );
  }

  ngOnInit(): void {

  }

  initInstitutions() {
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

  onConfirm(actionType): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
      }
    }
    let institutionId;
    if (this.byInstitution) {
      institutionId = this.selectedInstitution.id;
    }
    else if (this.isRequireInstitutionId) {
      institutionId = this.institutionId
    }
    const submit = () => {

      this.dialogRef.close({
        submit: true,
        name: this.name,
        description: this.description,
        file: this.currentFile,
        institutionId

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
        this.name
          ? submit()
          : warn('Please provide name');
      }
      else {

        this.name
        ? this.institutionId
          ? submit()
          : warn('Please provide institution id')
          : warn('Please provide name')

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

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

}

export class AddCertificateDialogModel {
  constructor(
    public dialogTitle: string,
    public item: any = [],
    public actionType: string = 'create',
    public buttonConfirm: string = 'Save',
    public buttonDismiss: string = 'Cancel'
  ) {
  }
}

