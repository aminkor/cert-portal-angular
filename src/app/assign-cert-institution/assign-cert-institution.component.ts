import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {AddCertificateDialogModel} from '../admin/master-data/certificate-list/add-certificate-dialog/add-certificate-dialog.component';
import {InstitutionService} from '../_services';

@Component({
  selector: 'app-assign-cert-institution',
  templateUrl: './assign-cert-institution.component.html',
  styleUrls: ['./assign-cert-institution.component.scss']
})
export class AssignCertInstitutionComponent implements OnInit {
  pageTitle;
  confirm: string;
  dismiss: string;
  selectedCertificate;
  institutionId;
  institutionsList;
  constructor(
    public dialogRef: MatDialogRef<AssignCertInstitutionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AssignCertInstitutionModel,
    private toastr: ToastrService,
    private institutionService: InstitutionService
  ) {
    this.pageTitle = data.dialogTitle;
    this.confirm = data.buttonConfirm;
    this.dismiss = data.buttonDismiss;
    this.selectedCertificate = data.item;

  }

  ngOnInit(): void {
    this.initInstitutions();
  }

  initInstitutions() {
    this.institutionService.getAll().subscribe(
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
    const submit = () => {

      this.dialogRef.close({
        submit: true,
        institutionId: this.institutionId

      });


    };

    const warn = message => {
      this.toastr.warning(message, '', {
        closeButton: true,
        progressBar: true
      });
    };

    this.institutionId
      ? submit()
      : warn('Please select institution');
  }

  onDismiss(): void {
    this.dialogRef.close({
      submit: false
    });
  }

}

export class AssignCertInstitutionModel {
  constructor(
    public dialogTitle: string,
    public item: any = [],
    public actionType: string = 'create',
    public buttonConfirm: string = 'Save',
    public buttonDismiss: string = 'Cancel'
  ) {
  }
}

