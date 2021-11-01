import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {AccountService, InstitutionService} from '../../../../_services';
import {AddCertificateDialogModel} from '../add-certificate-dialog/add-certificate-dialog.component';
import {DatePipe} from '@angular/common';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {Student, User} from '../../../../_models';
import {FormControl} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import {take, takeUntil} from 'rxjs/operators';

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
  studentIds = [];
  courseName: any;
  issuedDate: any;
  issuedDateForm: any;

  expiryDate: any;
  expiryDateForm: any;

  organization: any;
  studentList: User[];

  /** list of banks */
  protected banks: User[];

  /** control for the selected bank for multi-selection */
  public bankMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public bankMultiFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredBanksMulti: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
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
    this.initStudents();
  }

  ngOnInit(): void {
    // set initial selection
    // this.bankMultiCtrl.setValue([this.banks[10], this.banks[11], this.banks[12]]);


  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredBanksMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: User, b: User) => a && b && a.id === b.id;
      });
  }

  protected filterBanksMulti() {
    if (!this.banks) {
      return;
    }
    // get the search keyword
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      this.filteredBanksMulti.next(this.banks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanksMulti.next(
      this.banks.filter(usr => usr.firstName.toLowerCase().indexOf(search) > -1)
    );
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

  initStudents() {
    this.accountService.getAllStudents().subscribe(
      (data) => {
        this.banks = data;
        // load the initial bank list
        this.filteredBanksMulti.next(this.banks.slice());

        // listen for search field value changes
        this.bankMultiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterBanksMulti();
          });

        this.setInitialValue();

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
      else if (this.selectedAssignment === 'Students Selection') {

        this.bankMultiCtrl?.value.forEach(std => {
          this.studentIds.push(std.id);
        })

        this.institutionId = null;
        this.selectedStudentId = null;
      }


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
