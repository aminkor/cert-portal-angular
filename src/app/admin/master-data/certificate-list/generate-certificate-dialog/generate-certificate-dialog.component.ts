import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {AccountService, InstitutionService} from '../../../../_services';
import {AddCertificateDialogModel} from '../add-certificate-dialog/add-certificate-dialog.component';
import {DatePipe} from '@angular/common';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-generate-certificate-dialog',
  templateUrl: './generate-certificate-dialog.component.html',
  styleUrls: ['./generate-certificate-dialog.component.scss']
})
export class GenerateCertificateDialogComponent implements OnInit {
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
  selectedAssignment: any;
  assignmentChoices = ['Students Selection', 'By Institution'];
  templateId: any;
  certificateTemplates = [
    {
      id: 1,
      name: 'Template 1',
      thumbnail: '../../../../../assets/certificate-thumbnails/template-2.png'
    },
    {
      id: 2,
      name: 'Template 2',
      thumbnail: '../../../../../assets/certificate-thumbnails/template-1.png'
    }
  ];
  selectedTemplate;
  selectedStudentId: any;
  studentIds: any;
  courseName: any;
  issuedDate: any;
  issuedDateForm: any;

  expiryDate: any;
  expiryDateForm: any;

  organization: any;
  constructor(
    public dialogRef: MatDialogRef<GenerateCertificateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GenerateCertificateDialogModel,
    private toastr: ToastrService,
    private accountService: AccountService,
    private institutionService: InstitutionService,
    private datePipe: DatePipe
  ) {
    this.dialogTitle = data.dialogTitle;
    this.confirm = data.buttonConfirm;
    this.dismiss = data.buttonDismiss;
    this.name = data.item.name;
    this.description = data.item.description;
    this.byInstitution = data.item.byInstitution;
    this.selectedInstitution = data.item.selectedInstitution;

    this.initInstitutions();
  }

  ngOnInit(): void {
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


  onConfirm() {
    const submit = () => {

      if (this.selectedAssignment === 'By Institution') {
        this.selectedStudentId = null;
        this.studentIds = null
      }

      // this.issuedDate = this.datePipe.transform(this.issuedDate, 'yyyy-MM-dd')
      // this.expiryDate = this.datePipe.transform(this.expiryDate, 'yyyy-MM-dd')
      // console.log(this.issuedDate, this.expiryDate)
      this.dialogRef.close({
        submit: true,
        studentId: this.selectedStudentId,
        institutionId: this.institutionId,
        studentIds: this.studentIds,
        courseName: this.courseName,
        issuedDate: this.issuedDateForm,
        expiryDate: this.expiryDateForm,
        templateId: this.selectedTemplate.id,
        organization: this.organization

      });


    };
    const warn = message => {
      this.toastr.warning(message, '', {
        closeButton: true,
        progressBar: true
      });
    };
    console.log()
    // do some checking here
    submit()
  }

  onDismiss() {
    this.dialogRef.close({
      submit: false
    });
  }

  onChangeIssuedDate($event: MatDatepickerInputEvent<any, any>) {
    console.log($event.value);
    // @ts-ignore
    this.issuedDateForm = this.datePipe.transform($event.value, 'yyyy-MM-dd')
  }

  onChangeExpiryDate($event: MatDatepickerInputEvent<any, any>) {
    // @ts-ignore
    this.expiryDateForm = this.datePipe.transform($event.value, 'yyyy-MM-dd')
  }
}

export class GenerateCertificateDialogModel {
  constructor(
    public dialogTitle: string,
    public item: any = [],
    public actionType: string = 'create',
    public buttonConfirm: string = 'Generate',
    public buttonDismiss: string = 'Cancel'
  ) {
  }
}
